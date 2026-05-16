import { defineEventHandler, setResponseHeader } from 'h3'
import { $fetch } from 'ofetch'

interface PostStub {
  id: string
  published_at?: string | null
  updated_at?: string
  translations?: Array<{ lang: string; slug: string; updated_at?: string }>
}

interface ListResponse {
  items: PostStub[]
  total: number
}

const BASE = 'https://rodolfodebonis.com.br'

/**
 * Dynamic sitemap. Lists every public post in both languages with
 * cross-hreflang annotations so search engines understand the
 * PT↔EN pairing without guessing from the URL pattern.
 *
 * Static routes (home, /blog, /en/blog) come first; per-post entries
 * follow. Cached 1h shared so rebuild storms don't hammer the API.
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
          query: { lang: 'pt-BR', per_page: 500 },
          headers: { 'X-Tenant-ID': tenantId },
        }),
        $fetch<ListResponse>(`${baseUrl}/v1/public/posts`, {
          query: { lang: 'en', per_page: 500 },
          headers: { 'X-Tenant-ID': tenantId },
        }),
      ])
      postsPT = pt.items ?? []
      postsEN = en.items ?? []
    } catch (err) {
      // Don't fail the sitemap on API hiccup — emit just the static
      // routes. Better a partial sitemap than a 5xx.
      console.error('[sitemap] blog fetch failed', err)
    }
  }

  // Build per-post URL entries with bilingual alternates. Group by
  // post.id so the same physical post under two slugs links each other.
  const byID = new Map<
    string,
    { pt?: { slug: string; updated: string }; en?: { slug: string; updated: string } }
  >()

  function recordTranslation(
    list: PostStub[],
    lang: 'pt' | 'en',
  ) {
    for (const p of list) {
      // Translation list comes scoped to the requested lang (lang query
      // on the public list). Fall back to the post's first translation
      // if the API returns the post without translations attached.
      const t =
        p.translations?.find((tr) => tr.lang === (lang === 'pt' ? 'pt-BR' : 'en')) ??
        p.translations?.[0]
      if (!t) continue
      const entry = byID.get(p.id) ?? {}
      entry[lang] = { slug: t.slug, updated: t.updated_at ?? p.updated_at ?? '' }
      byID.set(p.id, entry)
    }
  }
  recordTranslation(postsPT, 'pt')
  recordTranslation(postsEN, 'en')

  const now = new Date().toISOString()
  const homeAlternates = [
    { hreflang: 'pt-BR', href: `${BASE}/` },
    { hreflang: 'en', href: `${BASE}/en` },
    { hreflang: 'x-default', href: `${BASE}/` },
  ]
  const blogAlternates = [
    { hreflang: 'pt-BR', href: `${BASE}/blog` },
    { hreflang: 'en', href: `${BASE}/en/blog` },
    { hreflang: 'x-default', href: `${BASE}/blog` },
  ]
  const staticEntries: Array<{ loc: string; lastmod?: string; alternates?: { hreflang: string; href: string }[] }> = [
    // Home root now has an EN mirror at /en thanks to @nuxtjs/i18n
    // (prefix_except_default). Sitemap must announce both with
    // bidirectional hreflang so the pair is treated as language
    // variants instead of duplicate content.
    { loc: `${BASE}/`, lastmod: now, alternates: homeAlternates },
    { loc: `${BASE}/en`, lastmod: now, alternates: homeAlternates },
    { loc: `${BASE}/blog`, lastmod: now, alternates: blogAlternates },
    { loc: `${BASE}/en/blog`, lastmod: now, alternates: blogAlternates },
  ]

  const postEntries: Array<{ loc: string; lastmod: string; alternates: { hreflang: string; href: string }[] }> = []
  for (const entry of byID.values()) {
    const ptHref = entry.pt ? `${BASE}/blog/${entry.pt.slug}` : null
    const enHref = entry.en ? `${BASE}/en/blog/${entry.en.slug}` : null
    const alternates: { hreflang: string; href: string }[] = []
    if (ptHref) alternates.push({ hreflang: 'pt-BR', href: ptHref })
    if (enHref) alternates.push({ hreflang: 'en', href: enHref })
    alternates.push({ hreflang: 'x-default', href: ptHref ?? enHref ?? BASE })

    if (ptHref) {
      postEntries.push({
        loc: ptHref,
        lastmod: entry.pt?.updated || new Date().toISOString(),
        alternates,
      })
    }
    if (enHref) {
      postEntries.push({
        loc: enHref,
        lastmod: entry.en?.updated || new Date().toISOString(),
        alternates,
      })
    }
  }

  const all = [...staticEntries, ...postEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all
  .map((entry) => {
    const altLines = (entry.alternates ?? [])
      .map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`,
      )
      .join('\n')
    return `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : ''}${altLines ? '\n' + altLines : ''}
  </url>`
  })
  .join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=900, s-maxage=3600')
  return xml
})
