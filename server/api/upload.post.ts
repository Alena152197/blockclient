import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { resolveStrapiBase } from '../utils/strapiBase'
import { assertContentEditor, strapiWriteAuthHeader } from '../utils/contentAdminGate'

/** Короткое имя файла для Strapi upload (влияет на hash/url в /uploads/…). */
function shortUploadFilename(original: string | undefined, mime: string | undefined) {
  const raw = String(original || 'f')
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
  // 8 hex ≈ уникальность на один upload; Strapi всё равно допишет свой hash-хвост
  const id = Date.now().toString(36).slice(-6)
  return `p${id}${ext}`
}

export default defineEventHandler(async (event) => {
  const baseUrl = resolveStrapiBase()
  const { auth } = await assertContentEditor(event)

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file provided'
    })
  }

  const file = formData[0]
  if (!file.data || !file.filename) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file data'
    })
  }

  try {
    const strapiFormData = new FormData()
    const blob = new Blob([file.data], { type: file.type || 'application/octet-stream' })
    // Короткие имена: About.content в Strapi ограничен (~920), а длинный
    // `![](/uploads/очень_длинное_имя_….jpg)` ломает сохранение фото.
    const safeName = shortUploadFilename(file.filename, file.type)
    strapiFormData.append('files', blob, safeName)

    const writeAuth = strapiWriteAuthHeader(auth, event)

    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: writeAuth
      },
      body: strapiFormData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Strapi upload error:', errorText)
      throw createError({
        statusCode: response.status,
        message:
          response.status === 403
            ? 'Strapi запретил upload. Нужен STRAPI_API_TOKEN (Full access) или права Upload у роли.'
            : `Upload failed: ${errorText.slice(0, 300)}`
      })
    }

    return await response.json()
  } catch (error: unknown) {
    console.error('Upload proxy error:', error)
    const errorObj = error as { statusCode?: number; status?: number; message?: string }
    if (errorObj.statusCode) throw error
    throw createError({
      statusCode: errorObj.status || 500,
      message: errorObj.message || 'Upload failed'
    })
  }
})
