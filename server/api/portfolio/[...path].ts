import {
  defineEventHandler,
  getRouterParam,
  getQuery,
  getRequestHeaders,
  createError,
  setResponseHeader,
  setResponseStatus,
  getMethod,
} from 'h3'
import { $fetch, FetchError } from 'ofetch'

/**
 * Server-side proxy for the portfolio CMS public API.
 *
 * Clone of /api/blog/* — same pattern of stripping browser session
 * headers, injecting X-Tenant-ID from env, and passing the upstream
 * Cache-Control + ETag through. Only GETs flow today (Phase 3 of the
 * CMS rollout). Admin lives behind Keycloak at /v1/portfolio/* and is
 * never reached from here.
 *
 * Routes proxied:
 *   GET /api/portfolio/profile      → /v1/public/portfolio/profile
 *   GET /api/portfolio/projects     → /v1/public/portfolio/projects
 *   GET /api/portfolio/experiences  → /v1/public/portfolio/experiences
 *   GET /api/portfolio/stacks       → /v1/public/portfolio/stacks
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({ statusCode: 400, message: 'Path required' })
  }

  const baseUrl = (
    process.env.BLOG_API_URL || 'https://api.management.rodolfodebonis.com.br'
  ).replace(/\/$/, '')
  const tenantId = process.env.BLOG_TENANT_ID || ''

  if (!tenantId) {
    throw createError({
      statusCode: 503,
      message:
        'Portfolio proxy not configured: BLOG_TENANT_ID is unset. Check Helm values + Vault.',
    })
  }

  const upstreamPath = `/v1/public/portfolio/${path}`
  const query = getQuery(event)
  const method = getMethod(event)
  const incomingHeaders = getRequestHeaders(event)

  const forward: Record<string, string> = {
    'X-Tenant-ID': tenantId,
    'Accept-Language': incomingHeaders['accept-language'] ?? 'pt-BR',
  }
  if (incomingHeaders['if-none-match']) {
    forward['If-None-Match'] = incomingHeaders['if-none-match']
  }
  if (incomingHeaders['x-forwarded-for']) {
    forward['X-Forwarded-For'] = incomingHeaders['x-forwarded-for']
  }

  try {
    const response = await $fetch.raw(`${baseUrl}${upstreamPath}`, {
      method: method as 'GET',
      query: query as Record<string, string>,
      headers: forward,
      ignoreResponseError: true,
    })

    for (const header of ['cache-control', 'etag', 'last-modified']) {
      const value = response.headers.get(header)
      if (value) setResponseHeader(event, header, value)
    }

    setResponseStatus(event, response.status)
    return response._data
  } catch (error) {
    if (error instanceof FetchError) {
      console.error('[portfolio proxy] upstream error', {
        path: upstreamPath,
        status: error.statusCode,
        message: error.message,
      })
    }
    throw createError({
      statusCode: 502,
      message: 'Portfolio API unreachable',
    })
  }
})
