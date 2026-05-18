/* eslint-disable require-await */
/**
 * Public-comments composable. Wraps the server-side proxy at
 * /api/blog/* which forwards to the rb_management_api public surface
 * with X-Tenant-ID injected. Types mirror
 * rb_management_api features/comments/domain/entities/comment.entity.go.
 *
 * The portfolio doesn't have visitor authentication today, so every
 * comment posted from here is anonymous (author_name + author_email
 * supplied in the body). The backend supports hybrid auth — when the
 * portfolio gets a Keycloak login flow, this composable just needs to
 * thread the Bearer token through and the upstream attributes the
 * comment to the authenticated user.
 */

export type CommentStatus = 'visible' | 'hidden' | 'deleted'

export interface BlogComment {
  id: string
  tenant_id: string
  post_id: string
  parent_id?: string | null
  author_sub?: string
  author_name: string
  author_email?: string
  author_url?: string
  body_md: string
  body_html: string
  status: CommentStatus
  flag_count?: number
  like_count: number
  /**
   * Reader-state field — populated only when the request opted in via
   * `X-Reader-State: true`. The thread fetch below always opts in
   * (comments aren't SSR-cached), so this is reliable on the client.
   */
  liked?: boolean
  edited_at?: string | null
  created_at: string
  updated_at: string
  children?: BlogComment[]
}

export interface CreateCommentInput {
  parent_id?: string | null
  author_name: string
  author_email: string
  author_url?: string
  body_md: string
  turnstile_token: string
}

export interface CreateCommentResponse {
  comment: BlogComment
  edit_token?: string
}

export interface FlagCommentInput {
  reason?: string
  /** Optional — backend gates flag spam via per-IP rate limit + dedup. */
  turnstile_token?: string
}

const editTokenStorageKey = (id: string) => `blog:comment:${id}:edit_token`

export function useComments() {
  return {
    /**
     * Fetch the comment tree for a published post (by slug + lang).
     * Always sends `X-Reader-State: true` so each node carries the
     * per-IP `liked` flag — comments are never SSR-cached (proxy has
     * `cache: false` for /api/blog/**), so opting in here costs
     * nothing extra and saves a separate round-trip.
     */
    async getByPostSlug(slug: string, lang: 'pt-BR' | 'en' = 'pt-BR'): Promise<BlogComment[]> {
      return $fetch<BlogComment[]>(`/api/blog/posts/${slug}/comments`, {
        query: { lang },
        headers: { 'X-Reader-State': 'true' },
      })
    },

    /**
     * Submit a new comment. Returns the created row plus the
     * anonymous edit_token, which we stash in localStorage so the
     * author can edit/delete within the 15-min window without an
     * account.
     */
    async create(slug: string, input: CreateCommentInput, lang: 'pt-BR' | 'en' = 'pt-BR'): Promise<BlogComment> {
      const res = await $fetch<CreateCommentResponse>(`/api/blog/posts/${slug}/comments`, {
        method: 'POST',
        query: { lang },
        body: input,
      })
      if (res.edit_token && import.meta.client) {
        try {
          window.localStorage.setItem(editTokenStorageKey(res.comment.id), res.edit_token)
        } catch {
          // localStorage can throw in private mode / quota exhaustion;
          // failure here just means edit isn't possible — not fatal.
        }
      }
      return res.comment
    },

    /**
     * Edit own anonymous comment. Returns the updated row, or throws
     * if the edit window has expired or the token is missing.
     */
    async edit(id: string, bodyMd: string): Promise<BlogComment> {
      const editToken = import.meta.client
        ? window.localStorage.getItem(editTokenStorageKey(id)) ?? ''
        : ''
      return $fetch<BlogComment>(`/api/blog/comments/${id}`, {
        method: 'PATCH',
        body: { body_md: bodyMd, edit_token: editToken },
      })
    },

    /** Report a comment. Server dedupes per IP. */
    async flag(id: string, input: FlagCommentInput): Promise<{ flag_count: number; duplicate: boolean }> {
      return $fetch<{ flag_count: number; duplicate: boolean }>(`/api/blog/comments/${id}/flag`, {
        method: 'POST',
        body: input,
      })
    },

    /**
     * Toggle a like on a comment. Same IP that already liked → -1 and
     * `liked: false`; new IP → +1 and `liked: true`. Rate-limited
     * 30/min/IP upstream — UNIQUE on (comment_id, ip_hash) is the
     * authoritative dedup.
     */
    async like(id: string): Promise<{ liked: boolean; like_count: number }> {
      return $fetch<{ liked: boolean; like_count: number }>(`/api/blog/comments/${id}/like`, {
        method: 'POST',
      })
    },

    /**
     * Has this client got an edit token for the given comment? Powers
     * the "Edit" button visibility on the rendered comment.
     */
    canEdit(id: string): boolean {
      if (!import.meta.client) return false
      try {
        return !!window.localStorage.getItem(editTokenStorageKey(id))
      } catch {
        return false
      }
    },
  }
}

/**
 * Returns true while the comment is still inside the 15-min edit
 * window — used to hide the Edit button after expiry without a
 * round-trip to the server.
 */
export function isWithinEditWindow(createdAt: string): boolean {
  const created = Date.parse(createdAt)
  if (Number.isNaN(created)) return false
  return Date.now() - created < 15 * 60 * 1000
}

/** Format a relative timestamp ("há 5 min", "5 min ago") in the given lang. */
export function formatCommentTime(iso: string, lang: 'pt-BR' | 'en'): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  const diffMs = Date.now() - t
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return lang === 'pt-BR' ? 'agora' : 'just now'
  if (mins < 60) return lang === 'pt-BR' ? `há ${mins} min` : `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return lang === 'pt-BR' ? `há ${hours}h` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return lang === 'pt-BR' ? `há ${days}d` : `${days}d ago`
  return new Date(t).toLocaleDateString(lang === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
