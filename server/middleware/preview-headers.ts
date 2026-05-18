import { defineEventHandler, getCookie, setResponseHeader } from 'h3'

/**
 * When the visitor has a `preview_token` cookie, override the
 * default Cache-Control so browsers (and downstream CDN proxies
 * respecting the header) don't serve stale anonymous HTML to a
 * preview reader. The SWR rule on `/` still caches the upstream
 * response by URL — that's a known limitation; the upside is the
 * preview reader's browser stops reusing its local cache once
 * cookie expires.
 */
export default defineEventHandler((event) => {
  if (getCookie(event, 'preview_token')) {
    setResponseHeader(event, 'Cache-Control', 'private, no-store')
  }
})
