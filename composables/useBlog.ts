/**
 * Public-blog composable. All requests go through the local
 * /api/blog/* proxy (server-side handler injects X-Tenant-ID).
 * Types mirror rb_management_api features/posts/domain/entities.
 */

export type Lang = 'pt-BR' | 'en'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface PostTranslation {
  id?: string
  post_id?: string
  tenant_id?: string
  lang: Lang
  slug: string
  title: string
  excerpt?: string
  content_md: string
  seo_title?: string
  seo_description?: string
  created_at?: string
  updated_at?: string
}

export interface TagTranslation {
  tag_id?: string
  lang: Lang
  name: string
}

export interface BlogTag {
  id: string
  tenant_id: string
  slug: string
  created_at: string
  translations?: TagTranslation[]
  post_count?: number
}

export interface BlogPost {
  id: string
  tenant_id: string
  author_identity_id: string
  status: PostStatus
  published_at?: string | null
  cover_image_url?: string
  og_image_url?: string
  reading_time_minutes: number
  view_count: number
  featured: boolean
  created_at: string
  updated_at: string
  translations?: PostTranslation[]
  tags?: BlogTag[]
}

export interface BlogListResponse {
  items: BlogPost[]
  page: number
  page_size: number
  total: number
}

interface BlogListFilter {
  lang?: Lang
  tag?: string
  q?: string
  page?: number
  per_page?: number
}

export function useBlog() {
  return {
    /** Most-recent N published posts — for the home widget. */
    async getLatest(lang: Lang = 'pt-BR', limit = 3): Promise<BlogPost[]> {
      return $fetch<BlogPost[]>('/api/blog/posts/latest', {
        query: { lang, limit },
      })
    },

    /** Paginated list with filters — for the /blog page. */
    async getList(filter: BlogListFilter = {}): Promise<BlogListResponse> {
      return $fetch<BlogListResponse>('/api/blog/posts', {
        query: {
          lang: filter.lang ?? 'pt-BR',
          tag: filter.tag,
          q: filter.q,
          page: filter.page,
          per_page: filter.per_page,
        },
      })
    },

    /** Single post by slug + lang — for /blog/[slug]. */
    async getBySlug(slug: string, lang: Lang = 'pt-BR'): Promise<BlogPost> {
      return $fetch<BlogPost>(`/api/blog/posts/by-slug/${slug}`, {
        query: { lang },
      })
    },

    /** Tag taxonomy with post counts — for the filter chips. */
    async getTags(): Promise<BlogTag[]> {
      return $fetch<BlogTag[]>('/api/blog/tags')
    },

    /**
     * Fire-and-forget view tracker. Upstream dedup keyed on (post, IP)
     * for 24h, so repeated calls from the same client are cheap. Don't
     * await the response — failure here should never break the article
     * page render.
     */
    registerView(slug: string, lang: Lang = 'pt-BR'): void {
      $fetch(`/api/blog/posts/by-slug/${slug}/view`, {
        method: 'POST',
        query: { lang },
      }).catch(() => {
        /* silent */
      })
    },
  }
}

/**
 * Pick the translation for a given language, falling back to the first
 * available one (the API always sends at least one).
 */
export function pickTranslation(
  post: BlogPost,
  lang: Lang,
): PostTranslation | undefined {
  if (!post.translations || post.translations.length === 0) return undefined
  return (
    post.translations.find((t) => t.lang === lang) ?? post.translations[0]
  )
}

/** Tag name in the requested language, falling back to the slug. */
export function pickTagName(tag: BlogTag, lang: Lang): string {
  const t = tag.translations?.find((tr) => tr.lang === lang)
  return t?.name ?? tag.slug
}
