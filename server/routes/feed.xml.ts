import { defineEventHandler, setResponseHeader } from 'h3'
import { $fetch } from 'ofetch'

interface PostStub {
  id: string
  published_at?: string | null
  updated_at?: string
  cover_image_url?: string
  author?: { name?: string; email?: string }
  translations?: Array<{ lang: string; slug: string; title: string; excerpt?: string; updated_at?: string }>
}

interface ListResponse {
  items: PostStub[]
  total: number
}

const BASE = 'https://rodolfodebonis.com.br'

/**
 * RSS 2.0 feed for the blog. Sister of sitemap.xml.ts — same fetch +
 * fallback pattern, just emits feed items instead of sitemap entries.
 *
 * One <item> per (post, language). PT-BR is the canonical channel
 * description; the EN translations show up alongside as additional
 * items rather than a separate feed (one URL is friendlier for
 * subscribers; clients filter on language if they care).
 *
 * 10 min cache matches the SWR routeRule on /blog so the feed never
 * lags the live page by more than one cycle.
 */
export default defineEventHandler(async (event) => {
  const baseUrl = (
    process.env.BLOG_API_URL || 'https://api.management.rodolfodebonis.com.br'
  ).replace(/\/$/, '')
  const tenantId = process.env.BLOG_TENANT_ID || ''

  let postsPT: PostStub[] = []
  let postsEN: PostStub[] = []

  if (tenantId) {
    try {
      const [pt, en] = await Promise.all([
        $fetch<ListResponse>(`${baseUrl}/v1/public/posts`, {
          query: { lang: 'pt-BR', per_page: 50 },
          headers: { 'X-Tenant-ID': tenantId },
        }),
        $fetch<ListResponse>(`${baseUrl}/v1/public/posts`, {
          query: { lang: 'en', per_page: 50 },
          headers: { 'X-Tenant-ID': tenantId },
        }),
      ])
      postsPT = pt.items ?? []
      postsEN = en.items ?? []
    } catch (err) {
      // Same posture as the sitemap — emit a valid (empty) feed
      // instead of 5xx so RSS readers don't blacklist the URL.
      console.error('[feed] blog fetch failed', err)
    }
  }

  type FeedItem = {
    title: string
    link: string
    guid: string
    description: string
    pubDate: string
    author?: string
    lang: 'pt-BR' | 'en'
  }

  const items: FeedItem[] = []

  function pushItems(list: PostStub[], lang: 'pt-BR' | 'en') {
    for (const p of list) {
      const t =
        p.translations?.find((tr) => tr.lang === lang) ?? p.translations?.[0]
      if (!t) continue
      const link =
        lang === 'pt-BR'
          ? `${BASE}/blog/${t.slug}`
          : `${BASE}/en/blog/${t.slug}`
      const pubDate = p.published_at
        ? new Date(p.published_at).toUTCString()
        : new Date().toUTCString()
      items.push({
        title: t.title,
        link,
        guid: link,
        description: t.excerpt ?? '',
        pubDate,
        author:
          p.author?.email && p.author?.name
            ? `${p.author.email} (${p.author.name})`
            : undefined,
        lang,
      })
    }
  }
  pushItems(postsPT, 'pt-BR')
  pushItems(postsEN, 'en')

  // Most-recent first so the top of the feed matches the blog list.
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const itemXml = items
    .map(
      (it) => `    <item>
      <title>${escape(it.title)}</title>
      <link>${it.link}</link>
      <guid isPermaLink="true">${it.guid}</guid>
      <description>${escape(it.description)}</description>
      <pubDate>${it.pubDate}</pubDate>
      ${it.author ? `<author>${escape(it.author)}</author>` : ''}
      <language>${it.lang}</language>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rodolfo De Bonis — Blog</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Notas técnicas, postmortems e experimentos sobre Go, observabilidade, multi-tenancy e infraestrutura.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemXml}
  </channel>
</rss>`

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=600, s-maxage=600')
  return xml
})
