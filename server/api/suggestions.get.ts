import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readSuggestions } from '../utils/suggestionsFile'

/** Все обращения — только content-admin. Свои: GET /api/suggestions/mine. */
export default defineEventHandler(async (event) => {
  await assertContentEditor(event)

  const { suggestions } = await readSuggestions()
  return {
    count: suggestions.length,
    suggestions
  }
})
