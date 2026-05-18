import {
  defineEventHandler,
  getQuery,
  setCookie,
  sendRedirect,
  createError,
} from 'h3'
import { $fetch } from 'ofetch'

/**
 * Entrypoint for preview mode. Admins generate a token in the portal
 * and share the resulting URL (`/preview/start?token=<raw>`) with
 * reviewers. This handler:
 *   1. Validates the token against the upstream CMS so the cookie
 *      lifetime matches the server's actual expiration.
 *   2. Sets an httpOnly `preview_token` cookie scoped to the same
 *      max-age.
 *   3. Redirects to `/` so the visitor sees the homepage with drafts
 *      surfaced + the PreviewBanner up top.
 *
 * Invalid tokens 404. We deliberately avoid revealing whether a
 * token ever existed (no 401 / no expired marker) — the admin can
 * re-mint trivially and that signal would just help anyone fuzzing
 * the surface.
 */
export default defineEventHandler(async (event) => {
  const token = (getQuery(event).token as string | undefined)?.trim()
  if (!token) {
    throw createError({ statusCode: 400, message: 'token required' })
  }

  const baseUrl = (
    process.env.BLOG_API_URL || 'https://api.management.rodolfodebonis.com.br'
  ).replace(/\/$/, '')
  const tenantId = process.env.BLOG_TENANT_ID || ''
  if (!tenantId) {
    throw createError({ statusCode: 503, message: 'Preview not configured' })
  }

  try {
    const check = await $fetch<{ valid: boolean; expires_at?: string }>(
      `${baseUrl}/v1/public/portfolio/preview-check`,
      {
        query: { token },
        headers: { 'X-Tenant-ID': tenantId },
      },
    )
    if (!check.valid || !check.expires_at) {
      throw createError({ statusCode: 404, message: 'invalid token' })
    }
    const expiresAt = new Date(check.expires_at)
    const maxAge = Math.max(
      1,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    )
    setCookie(event, 'preview_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    return await sendRedirect(event, '/', 302)
  } catch (err) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }
    throw createError({ statusCode: 502, message: 'preview-check unreachable' })
  }
})
