import { defineEventHandler, getHeader, readMultipartFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://324cbb377ef9.vps.myjino.ru'
  
  // Получаем токен из заголовков
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Authorization header is required'
    })
  }

  // Получаем файл из FormData
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
    // Создаем новый FormData для отправки на Strapi
    const strapiFormData = new FormData()
    
    // Создаем Blob из данных файла
    const blob = new Blob([file.data], { type: file.type || 'application/octet-stream' })
    strapiFormData.append('files', blob, file.filename)

    // Отправляем запрос на Strapi через сервер (без CORS проблем)
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
        // Не добавляем Content-Type, браузер установит его автоматически с boundary
      },
      body: strapiFormData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Strapi upload error:', errorText)
      throw createError({
        statusCode: response.status,
        message: `Upload failed: ${errorText}`
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Upload proxy error:', error)
    const errorObj = error as any
    throw createError({
      statusCode: errorObj.statusCode || errorObj.status || 500,
      message: errorObj.message || 'Upload failed'
    })
  }
})

