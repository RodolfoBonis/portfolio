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
  /**
   * Per-language cover. When empty the post-level `cover_image_url` is
   * used instead — see {@link getCoverImageUrl}. Lets the pt/en art stay
   * coherent (e.g. a title baked into the image).
   */
  cover_image_url?: string
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

export interface BlogAuthor {
  sub: string
  name: string
  email?: string
}

export interface BlogPost {
  id: string
  tenant_id: string
  author: BlogAuthor
  status: PostStatus
  published_at?: string | null
  cover_image_url?: string
  og_image_url?: string
  reading_time_minutes: number
  view_count: number
  like_count: number
  /**
   * Reader-state field — present only when the request opted in via
   * `X-Reader-State: true`. Initial SSR fetch leaves this `undefined`
   * to keep the response cacheable; the client hydrates it on mount.
   */
  liked?: boolean
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

    /**
     * Toggle a like on the post. Same IP that already liked → -1 and
     * `liked: false`; new IP → +1 and `liked: true`. Rate-limited
     * 30/min/IP upstream so a burst of click-spam degrades to 429
     * before the dedup table is touched.
     */
    async likePost(
      slug: string,
      lang: Lang = 'pt-BR',
    ): Promise<{ liked: boolean; like_count: number }> {
      return $fetch<{ liked: boolean; like_count: number }>(
        `/api/blog/posts/by-slug/${slug}/like`,
        {
          method: 'POST',
          query: { lang },
        },
      )
    },

    /**
     * Hydrate the per-reader liked flag for an already-rendered post.
     * Called once on mount — SSR omits the X-Reader-State header so
     * the shared cache stays usable, then the client follows up with
     * this dedicated authoritative fetch. Returns just the fields the
     * UI needs; ignores the rest of the (already-rendered) post body.
     */
    async fetchReaderState(
      slug: string,
      lang: Lang = 'pt-BR',
    ): Promise<{ liked: boolean; like_count: number }> {
      const post = await $fetch<BlogPost>(
        `/api/blog/posts/by-slug/${slug}`,
        {
          query: { lang },
          headers: { 'X-Reader-State': 'true' },
        },
      )
      return {
        liked: post.liked === true,
        like_count: post.like_count ?? 0,
      }
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

/**
 * Resolve the cover image to render: the translation's own cover when it
 * has one, otherwise the shared post-level cover (the fallback that keeps
 * existing posts rendering unchanged).
 */
export function getCoverImageUrl(
  post: BlogPost,
  translation: PostTranslation | undefined,
): string | undefined {
  return translation?.cover_image_url || post.cover_image_url
}

/** Tag name in the requested language, falling back to the slug. */
export function pickTagName(tag: BlogTag, lang: Lang): string {
  const t = tag.translations?.find((tr) => tr.lang === lang)
  return t?.name ?? tag.slug
}
