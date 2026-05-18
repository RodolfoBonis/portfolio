<template>
  <div>
    <MainHeader />
    <main>
      <Hero :profile="profile" />
      <About :profile="profile" />
      <Stacks :stacks="stacks" />
      <Projects :projects="projects" />
      <!-- Latest posts widget feeds off the active locale so a PT
           visitor on /en still sees EN summaries via the same
           composable as the /en/blog list page. -->
      <BlogLatestPosts :lang="locale === 'en' ? 'en' : 'pt-BR'" :limit="3" />
      <Experience :experiences="experiences" />
      <Contact :profile="profile" />
    </main>
  </div>
</template>

<script setup>
import { usePortfolio } from '~/composables/usePortfolio'

const { t, locale } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'pt-BR'))

// Root-level fetch of the CMS payload for the four sections. Single
// useAsyncData call so SSR pre-renders the data once and every child
// component receives it via props — avoids four separate request
// waterfalls during hydration. SWR cache rules in nuxt.config (`/`,
// `/en`) cap freshness at 10 min.
const { data } = await useAsyncData(
  `home-portfolio-${lang.value}`,
  async () => {
    const api = usePortfolio()
    const [profile, projects, experiences, stacks] = await Promise.all([
      api.getProfile(lang.value).catch(() => null),
      api.getProjects(lang.value).catch(() => []),
      api.getExperiences(lang.value).catch(() => []),
      api.getStacks(lang.value).catch(() => []),
    ])
    return { profile, projects, experiences, stacks }
  },
  {
    // Re-runs when the visitor flips locale so EN sees EN copy
    // without a navigation. The cache key above keeps PT/EN
    // payloads separate.
    watch: [lang],
    server: true,
  },
)

const profile = computed(() => data.value?.profile ?? null)
const projects = computed(() => data.value?.projects ?? [])
const experiences = computed(() => data.value?.experiences ?? [])
const stacks = computed(() => data.value?.stacks ?? [])

// SEO uses the CMS-rendered fields with a defensive fallback to the
// i18n bundle so a cold cache or 5xx upstream still ships a meta
// tag. ogImage prefers the profile's og_image_url; the historical
// CDN path stays as the safety net.
useLocaleHead({ addSeoAttributes: true })

useSeoMeta({
  title: () => profile.value?.seo_title || t('seo.home.title'),
  description: () =>
    profile.value?.seo_description || t('seo.home.description'),
  ogTitle: () => profile.value?.seo_title || t('seo.home.title'),
  ogDescription: () =>
    profile.value?.og_description || t('seo.home.ogDescription'),
  ogImage: () =>
    profile.value?.og_image_url ||
    'https://rodolfodebonis.com.br/api/cdn/portfolio/me.jpeg',
  ogUrl: () =>
    locale.value === 'en'
      ? 'https://rodolfodebonis.com.br/en'
      : 'https://rodolfodebonis.com.br',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// JSON-LD Person — recomputed so the description + URL track the
// active locale AND the live profile data. Google's Knowledge Graph
// dedupes by URL, so each language variant points at its own
// canonical (/ or /en) and declares `inLanguage` explicitly.
const personJsonLD = computed(() => {
  const p = profile.value
  const fallbackDesc = t('seo.home.description')
  const sameAs = []
  if (p?.github_url) sameAs.push(p.github_url)
  if (p?.linkedin_url) sameAs.push(p.linkedin_url)
  if (p?.twitter_url) sameAs.push(p.twitter_url)
  if (sameAs.length === 0) {
    sameAs.push(
      'https://github.com/RodolfoBonis',
      'https://www.linkedin.com/in/rodolfo-de-bonis/',
      'https://x.com/RodolfoBonis',
    )
  }
  // knowsAbout takes the union of every tech tag we know about from
  // the experiences timeline + stack items so the schema reflects
  // the same skill surface the page advertises. Dedup + cap at 12
  // tags so the JSON stays small.
  const skills = new Set()
  for (const e of experiences.value) {
    for (const tag of e.tech_tags ?? []) skills.add(tag)
  }
  for (const cat of stacks.value) {
    for (const item of cat.items ?? []) skills.add(item.name)
  }
  const knowsAbout = Array.from(skills).slice(0, 12)
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p?.name ?? 'Rodolfo De Bonis',
    url:
      locale.value === 'en'
        ? 'https://rodolfodebonis.com.br/en'
        : 'https://rodolfodebonis.com.br',
    jobTitle: p?.headline ?? 'Software Engineer',
    description: p?.seo_description || fallbackDesc,
    inLanguage: locale.value,
    address: {
      '@type': 'PostalAddress',
      addressLocality: p?.location_city ?? 'Maceió',
      addressRegion: p?.location_region ?? 'AL',
      addressCountry: p?.location_country ?? 'BR',
    },
    sameAs,
    knowsAbout: knowsAbout.length > 0
      ? knowsAbout
      : ['Go', 'Flutter', 'Kubernetes', 'DevOps', 'Python', 'TypeScript'],
  })
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: personJsonLD,
    },
  ],
})
</script>
