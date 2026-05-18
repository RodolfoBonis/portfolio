import {
  defineEventHandler,
  getRouterParam,
  getQuery,
  getRequestHeaders,
  createError,
  setResponseHeader,
  setResponseStatus,
  readBody,
  getMethod,
} from 'h3'
import { $fetch, FetchError } from 'ofetch'

/**
 * Server-side proxy for the bilingual blog public API.
 *
 * The browser hits `/api/blog/posts?lang=pt-BR` and we forward it to
 * `<BLOG_API_URL>/v1/public/posts?lang=pt-BR` while injecting the
 * tenant header from BLOG_TENANT_ID (Helm-injected from Vault). Two
 * benefits:
 *   1. The API URL + tenant id stay server-only — no leakage to the
 *      browser.
 *   2. The Helm-managed tenant id can change without re-publishing
 *      a JS bundle.
 *
 * Routes proxied:
 *   GET  /api/blog/posts                        → /v1/public/posts
 *   GET  /api/blog/posts/latest                 → /v1/public/posts/latest
 *   GET  /api/blog/posts/by-slug/:slug          → /v1/public/posts/by-slug/:slug
 *   POST /api/blog/posts/by-slug/:slug/view     → /v1/public/posts/by-slug/:slug/view
 *   POST /api/blog/posts/by-slug/:slug/like     → /v1/public/posts/by-slug/:slug/like
 *   POST /api/blog/comments/:id/like            → /v1/public/comments/:id/like
 *   GET  /api/blog/tags                         → /v1/public/tags
 *
 * Cache passthrough: relays the upstream Cache-Control + ETag so the
 * browser/CDN respects the same TTL the Go API set.
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({
      statusCode: 400,
      message: 'Path required',
    })
  }

  // Read directly from env so we don't depend on the Nuxt runtime
  // config typing in the Nitro context. Defaults match nuxt.config.
  const baseUrl = (
    process.env.BLOG_API_URL || 'https://api.management.rodolfodebonis.com.br'
  ).replace(/\/$/, '')
  const tenantId = process.env.BLOG_TENANT_ID || ''

  if (!tenantId) {
    // Loud-fail: an empty tenant id means the API would 400 every
    // request anyway. Surface the misconfig instead of returning
    // confusing upstream errors.
    throw createError({
      statusCode: 503,
      message:
        'Blog proxy not configured: BLOG_TENANT_ID is unset. Check Helm values + Vault.',
    })
  }

  const upstreamPath = `/v1/public/${path}`
  const query = getQuery(event)
  const method = getMethod(event)
  const incomingHeaders = getRequestHeaders(event)

  // Forward only the headers the upstream cares about. Strip
  // host/cookie/auth so the proxy doesn't accidentally leak the
  // browser's session into the upstream request.
  const forward: Record<string, string> = {
    'X-Tenant-ID': tenantId,
    'Accept-Language': incomingHeaders['accept-language'] ?? 'pt-BR',
  }
  if (incomingHeaders['if-none-match']) {
    forward['If-None-Match'] = incomingHeaders['if-none-match']
  }
  // Use the real client IP for view + like dedup keying upstream.
  if (incomingHeaders['x-forwarded-for']) {
    forward['X-Forwarded-For'] = incomingHeaders['x-forwarded-for']
  }
  // Forward the reader-state opt-in so BySlug and the comment thread
  // can return per-reader `liked` flags. Upstream downgrades
  // Cache-Control to private,no-store when this is present, so the
  // shared cache never sees IP-specific responses.
  if (incomingHeaders['x-reader-state']) {
    forward['X-Reader-State'] = incomingHeaders['x-reader-state']
  }

  let body: Record<string, unknown> | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = (await readBody(event).catch(() => undefined)) as
      | Record<string, unknown>
      | undefined
  }

  try {
    const response = await $fetch.raw(`${baseUrl}${upstreamPath}`, {
      method: method as 'GET' | 'POST',
      query: query as Record<string, string>,
      headers: forward,
      body,
      // Don't throw on non-2xx so we can pass through the upstream
      // status to the browser (especially 304 Not Modified).
      ignoreResponseError: true,
    })

    // Pass cache headers through so the CDN/browser honour the upstream
    // TTL set by the Go API (max-age + s-maxage + ETag).
    for (const header of ['cache-control', 'etag', 'last-modified']) {
      const value = response.headers.get(header)
      if (value) setResponseHeader(event, header, value)
    }

    setResponseStatus(event, response.status)
    return response._data
  } catch (error) {
    // Genuine network/transport error — log and 502.
    if (error instanceof FetchError) {
      console.error('[blog proxy] upstream error', {
        path: upstreamPath,
        status: error.statusCode,
        message: error.message,
      })
    }
    throw createError({
      statusCode: 502,
      message: 'Blog API unreachable',
    })
  }
})
