import { defineEventHandler, readMultipartFormData, getHeader, createError } from 'h3'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { strapiWriteAuthHeader } from '../../utils/contentAdminGate'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { assertKeyedRateLimit, assertRateLimit } from '../../utils/rateLimit'

const MAX_BYTES = 2 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

function shortUploadFilename(mime: string | undefined) {
  const ext =
    mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg'
  return `av${Date.now().toString(36).slice(-6)}${ext}`
}

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png'
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}

/**
 * Смена аватара для вошедшего пользователя.
 * Привязка только к своему id из verified JWT. Upload: сначала JWT пользователя,
 * API Token — только fallback (файл всё равно линкуется только к себе).
 */
export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    key: 'avatar-ip',
    limit: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Слишком много загрузок аватара. Попробуйте позже.'
  })

  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Нужна авторизация' })
  }

  assertKeyedRateLimit(`avatar-user:${user.id}`, {
    limit: 8,
    windowMs: 60 * 60 * 1000,
    message: 'Лимит смены аватара на час исчерпан.'
  })

  const formData = await readMultipartFormData(event)
  if (!formData?.length) {
    throw createError({ statusCode: 400, message: 'Выберите файл изображения' })
  }

  const file = formData[0]
  if (!file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Некорректный файл' })
  }
  if (file.data.byteLength > MAX_BYTES) {
    throw createError({ statusCode: 400, message: 'Файл слишком большой (макс. 2 МБ)' })
  }

  const buf = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data)
  const sniffed = sniffImageMime(buf)
  const declared = String(file.type || '').toLowerCase()
  if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
    throw createError({
      statusCode: 400,
      message: 'Разрешены только JPEG, PNG или WebP (не SVG/GIF).'
    })
  }
  if (declared && declared !== 'application/octet-stream' && !ALLOWED_MIME.has(declared)) {
    throw createError({ statusCode: 400, message: 'Неверный тип файла.' })
  }

  const mime = sniffed
  const baseUrl = resolveStrapiBase()
  const userAuth = authHeader || ''
  const apiAuth = strapiWriteAuthHeader(userAuth, event)

  const bytes = new Uint8Array(buf)

  function buildUploadForm() {
    const form = new FormData()
    form.append('files', new Blob([bytes], { type: mime }), shortUploadFilename(mime))
    return form
  }

  let uploadRes = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: { Authorization: userAuth },
    body: buildUploadForm()
  })
  if (!uploadRes.ok && apiAuth !== userAuth) {
    uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: { Authorization: apiAuth },
      body: buildUploadForm()
    })
  }

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text()
    console.error('Profile avatar upload error:', uploadRes.status, errorText.slice(0, 400))
    throw createError({
      statusCode: uploadRes.status,
      message:
        uploadRes.status === 403
          ? 'Strapi запретил upload. Нужен STRAPI_API_TOKEN или права Upload у роли.'
          : `Ошибка загрузки: ${errorText.slice(0, 200)}`
    })
  }

  const uploaded = await uploadRes.json()
  const fileRow = Array.isArray(uploaded) ? uploaded[0] : uploaded
  const avatarId = fileRow?.id
  if (avatarId == null) {
    throw createError({ statusCode: 502, message: 'Strapi не вернул id файла' })
  }

  const userId = user.id
  const updateBodies = [
    { avatar: avatarId },
    { avatar: { set: [avatarId] } },
    { avatar: { connect: [avatarId] } }
  ]

  let updateOk = false
  let lastErr = ''
  for (const auth of [userAuth, apiAuth]) {
    for (const body of updateBodies) {
      const updateRes = await fetch(`${baseUrl}/api/users/${encodeURIComponent(String(userId))}`, {
        method: 'PUT',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (updateRes.ok) {
        updateOk = true
        break
      }
      lastErr = await updateRes.text().catch(() => '')
    }
    if (updateOk) break
  }

  if (!updateOk) {
    console.error('Profile avatar link error:', lastErr.slice(0, 400))
    throw createError({
      statusCode: 502,
      message:
        'Файл загружен, но не удалось привязать к профилю. В Strapi Users разрешите update avatar.'
    })
  }

  const url = typeof fileRow.url === 'string' ? fileRow.url : null
  return {
    ok: true,
    id: avatarId,
    url,
    message: 'Фото профиля обновлено'
  }
})
