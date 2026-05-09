import {
  defineEventHandler,
  getRouterParam,
  getQuery,
  setResponseHeader,
  createError,
} from 'h3'
import { renderMarkdown } from '~/server/utils/renderMarkdown'

/**
 * Server-side endpoint that fetches a post via the local blog proxy
 * AND renders its Markdown to HTML in the same request. The page
 * component awaits the response in setup, so the Vue tree gets the
 * already-rendered HTML and Shiki never reaches the browser.
 *
 * Cache: 5 min public, 1h shared (matches the upstream detail TTL).
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'slug required' })
  }
  const lang = (getQuery(event).lang as string) || 'pt-BR'

  const post = await $fetch<{
    id: string
    translations?: Array<{ lang: string; content_md: string; title: string }>
    [k: string]: unknown
  }>(`/api/blog/posts/by-slug/${slug}`, {
    query: { lang },
  })

  const translation = post.translations?.find((t) => t.lang === lang)
  const content = translation?.content_md ?? ''
  const rendered = await renderMarkdown(content)

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=3600',
  )

  return {
    post,
    html: rendered.html,
    reading_time_minutes: rendered.readingTimeMinutes,
  }
})
