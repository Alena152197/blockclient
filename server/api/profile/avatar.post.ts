import { defineEventHandler, readMultipartFormData, getHeader, createError } from 'h3'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { strapiWriteAuthHeader } from '../../utils/contentAdminGate'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'

const MAX_BYTES = 8 * 1024 * 1024

function shortUploadFilename(original: string | undefined, mime: string | undefined) {
  const raw = String(original || 'avatar')
  const extFromName = (raw.match(/(\.[a-z0-9]{1,8})$/i) || [])[1] || ''
  const extFromMime =
    mime === 'image/jpeg' || mime === 'image/jpg'
      ? '.jpg'
      : mime === 'image/png'
        ? '.png'
        : mime === 'image/webp'
          ? '.webp'
          : mime === 'image/gif'
            ? '.gif'
            : ''
  const ext = (extFromName || extFromMime || '.jpg').toLowerCase()
  return `av${Date.now().toString(36).slice(-6)}${ext}`
}

/**
 * Смена аватара для любого вошедшего пользователя (не только админа).
 * Upload + привязка к users через STRAPI_API_TOKEN при необходимости.
 */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Нужна авторизация' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData?.length) {
    throw createError({ statusCode: 400, message: 'Выберите файл изображения' })
  }

  const file = formData[0]
  if (!file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Некорректный файл' })
  }
  if (file.data.byteLength > MAX_BYTES) {
    throw createError({ statusCode: 400, message: 'Файл слишком большой (макс. 8 МБ)' })
  }
  const mime = file.type || 'application/octet-stream'
  if (!String(mime).startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Можно загружать только изображения' })
  }

  const baseUrl = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(authHeader || '', event)

  const strapiForm = new FormData()
  const blob = new Blob([file.data], { type: mime })
  strapiForm.append('files', blob, shortUploadFilename(file.filename, mime))

  const uploadRes = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: { Authorization: writeAuth },
    body: strapiForm
  })

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text()
    console.error('Profile avatar upload error:', uploadRes.status, errorText.slice(0, 400))
    throw createError({
      statusCode: uploadRes.status,
      message:
        uploadRes.status === 403
          ? 'Strapi запретил upload. Нужен STRAPI_API_TOKEN в .env Nuxt.'
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
  for (const body of updateBodies) {
    const updateRes = await fetch(`${baseUrl}/api/users/${encodeURIComponent(String(userId))}`, {
      method: 'PUT',
      headers: {
        Authorization: writeAuth,
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

  if (!updateOk) {
    console.error('Profile avatar link error:', lastErr.slice(0, 400))
    throw createError({
      statusCode: 502,
      message:
        'Файл загружен, но не удалось привязать к профилю. В Strapi Users разрешите update avatar или проверьте API Token.'
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
