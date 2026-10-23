import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { readSuggestions } from '../utils/suggestionsFile'

export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { suggestions } = await readSuggestions()
  return {
    count: suggestions.length,
    suggestions
  }
})
