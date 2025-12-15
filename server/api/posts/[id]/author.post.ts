import { defineEventHandler, getHeader, readBody, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://324cbb377ef9.vps.myjino.ru'
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required'
    })
  }

  // Получаем токен из заголовков
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Authorization header is required'
    })
  }

  // Получаем author ID из тела запроса
  const body = await readBody(event)
  const authorId = body?.authorId || body?.author

  if (!authorId) {
    throw createError({
      statusCode: 400,
      message: 'Author ID is required'
    })
  }

  try {
    // Пробуем разные форматы для установки связи author в Strapi v4
    // Формат 1: Просто ID
    let response = await fetch(`${baseUrl}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        data: {
          author: authorId
        }
      })
    })

    // Если не сработало, пробуем формат с connect
    if (!response.ok) {
      console.log('Пробуем формат с connect...')
      response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          data: {
            author: {
              connect: [authorId]
            }
          }
        })
      })
    }

    // Если не сработало, пробуем формат с set
    if (!response.ok) {
      console.log('Пробуем формат с set...')
      response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          data: {
            author: {
              set: [authorId]
            }
          }
        })
      })
    }

    // Если не сработало, пробуем получить пользователя по ID и использовать его documentId
    if (!response.ok) {
      console.log('Пробуем получить documentId пользователя...')
      try {
        const userResponse = await fetch(`${baseUrl}/api/users/${authorId}`, {
          headers: {
            'Authorization': authHeader
          }
        })
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          const userDocumentId = userData.documentId || userData.id
          
          // Пробуем с documentId
          response = await fetch(`${baseUrl}/api/posts/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify({
              data: {
                author: userDocumentId
              }
            })
          })
        }
      } catch (userError) {
        console.error('Ошибка при получении данных пользователя:', userError)
      }
    }

    if (!response.ok) {
      let errorMessage = 'Failed to update author'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error?.message || errorData.message || errorMessage
        console.error('Strapi API error:', JSON.stringify(errorData, null, 2))
      } catch (e) {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
        console.error('Strapi API error (text):', errorText)
      }
      throw createError({
        statusCode: response.status,
        message: errorMessage
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    const errorObj = error as any
    throw createError({
      statusCode: errorObj.statusCode || errorObj.status || 500,
      message: errorObj.message || 'Failed to update author'
    })
  }
})

