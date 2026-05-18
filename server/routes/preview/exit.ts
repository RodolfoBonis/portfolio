import { defineEventHandler, deleteCookie, sendRedirect } from 'h3'

/**
 * Tears down preview mode: clears the `preview_token` cookie and
 * sends the visitor back to `/`. Used by the PreviewBanner's "Sair"
 * button. Idempotent — calling without a cookie is a no-op redirect.
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'preview_token', { path: '/' })
  return await sendRedirect(event, '/', 302)
})
