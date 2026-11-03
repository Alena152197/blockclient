import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { resolveStrapiBase } from '../../../utils/strapiBase'
import { assertContentEditor, strapiWriteAuthHeader } from '../../../utils/contentAdminGate'

/** Установка автора поста — только content-admin. */
export default defineEventHandler(async (event) => {
  const baseUrl = resolveStrapiBase()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required'
    })
  }

  const { auth } = await assertContentEditor(event)
  const writeAuth = strapiWriteAuthHeader(auth, event)

  const body = await readBody(event)
  const authorId = body?.authorId || body?.author

  if (!authorId) {
    throw createError({
      statusCode: 400,
      message: 'Author ID is required'
    })
  }

  try {
    let response = await fetch(`${baseUrl}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: writeAuth
      },
      body: JSON.stringify({
        data: {
          author: authorId
        }
      })
    })

    if (!response.ok) {
      response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: writeAuth
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

    if (!response.ok) {
      response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: writeAuth
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

    if (!response.ok) {
      try {
        const userResponse = await fetch(`${baseUrl}/api/users/${authorId}`, {
          headers: {
            Authorization: writeAuth
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          const userDocumentId = userData.documentId || userData.id

          response = await fetch(`${baseUrl}/api/posts/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: writeAuth
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
      } catch {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
        console.error('Strapi API error (text):', errorText)
      }
      throw createError({
        statusCode: response.status,
        message: errorMessage
      })
    }

    return await response.json()
  } catch (error) {
    const errorObj = error as { statusCode?: number; status?: number; message?: string }
    if (errorObj.statusCode) throw error
    throw createError({
      statusCode: errorObj.statusCode || errorObj.status || 500,
      message: errorObj.message || 'Failed to update author'
    })
  }
})
