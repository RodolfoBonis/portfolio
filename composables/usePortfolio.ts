/**
 * Public portfolio CMS composable. All requests go through the local
 * /api/portfolio/* proxy (server-side handler injects X-Tenant-ID).
 * Types mirror rb_management_api features/portfolio/domain/entities.
 *
 * The CMS endpoints flatten translations into the requested language
 * already, so the consumer never iterates a translations[] array on
 * the public surface — that lives only in the admin shape.
 */

export type Lang = 'pt-BR' | 'en'

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface PortfolioProfile {
  name: string
  avatar_url?: string
  years_experience?: number
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  email?: string
  formspree_endpoint?: string
  og_image_url?: string
  location_city?: string
  location_region?: string
  location_country?: string
  /** Shell-looking strings cycled in the Hero's terminal animation. */
  terminal_commands?: string[]
  // Translated fields — flattened by the API for the requested lang.
  headline?: string
  subtitle?: string
  bio_html?: string
  languages?: string[]
  hobbies?: string[]
  footer_tagline?: string
  seo_title?: string
  seo_description?: string
  og_description?: string
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface PortfolioProject {
  id: string
  slug: string
  image_url?: string
  github_url?: string
  live_url?: string
  tags?: string[]
  title: string
  description_html?: string
  highlights?: string[]
}

// ---------------------------------------------------------------------------
// Experiences
// ---------------------------------------------------------------------------

export interface PortfolioExperience {
  id: string
  slug: string
  /** ISO date-only. */
  period_start: string
  period_end?: string | null
  current: boolean
  tech_tags?: string[]
  title: string
  company?: string
  description_html?: string
  achievements?: string[]
}

// ---------------------------------------------------------------------------
// Stacks
// ---------------------------------------------------------------------------

export interface PortfolioStackItem {
  id: string
  name: string
  icon_path?: string
}

export interface PortfolioStackCategory {
  id: string
  slug: string
  name: string
  items: PortfolioStackItem[]
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function usePortfolio() {
  return {
    async getProfile(lang: Lang = 'pt-BR'): Promise<PortfolioProfile> {
      return $fetch<PortfolioProfile>('/api/portfolio/profile', {
        query: { lang },
      })
    },

    async getProjects(lang: Lang = 'pt-BR'): Promise<PortfolioProject[]> {
      return $fetch<PortfolioProject[]>('/api/portfolio/projects', {
        query: { lang },
      })
    },

    async getExperiences(lang: Lang = 'pt-BR'): Promise<PortfolioExperience[]> {
      return $fetch<PortfolioExperience[]>('/api/portfolio/experiences', {
        query: { lang },
      })
    },

    async getStacks(lang: Lang = 'pt-BR'): Promise<PortfolioStackCategory[]> {
      return $fetch<PortfolioStackCategory[]>('/api/portfolio/stacks', {
        query: { lang },
      })
    },
  }
}
