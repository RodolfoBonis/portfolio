<template>
  <div>
    <MainHeader />
    <main>
      <Hero />
      <About />
      <Stacks />
      <Projects />
      <!-- Latest posts widget feeds off the active locale so a PT
           visitor on /en still sees EN summaries via the same
           composable as the /en/blog list page. -->
      <BlogLatestPosts :lang="locale === 'en' ? 'en' : 'pt-BR'" :limit="3" />
      <Experience />
      <Contact />
    </main>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
// useLocaleHead injects <html lang> + hreflang alternates per the
// configured baseUrl. SEO fields below come from the active locale.
useLocaleHead({ addSeoAttributes: true })

useSeoMeta({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  ogTitle: t('seo.home.title'),
  ogDescription: t('seo.home.ogDescription'),
  ogImage: 'https://rodolfodebonis.com.br/api/cdn/portfolio/me.jpeg',
  ogUrl:
    locale.value === 'en'
      ? 'https://rodolfodebonis.com.br/en'
      : 'https://rodolfodebonis.com.br',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// JSON-LD Person — computed so the description + URL track the
// active locale. Google's Knowledge Graph dedupes by URL, so each
// language variant points at its own canonical (/ or /en) and
// declares `inLanguage` explicitly.
const personJsonLD = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rodolfo De Bonis',
    url:
      locale.value === 'en'
        ? 'https://rodolfodebonis.com.br/en'
        : 'https://rodolfodebonis.com.br',
    jobTitle: 'Software Engineer',
    description: t('seo.home.description'),
    inLanguage: locale.value,
    worksFor: { '@type': 'Organization', name: 'Loft' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Maceió',
      addressRegion: 'AL',
      addressCountry: 'BR',
    },
    sameAs: [
      'https://github.com/RodolfoBonis',
      'https://www.linkedin.com/in/rodolfo-de-bonis/',
      'https://x.com/RodolfoBonis',
    ],
    knowsAbout: ['Go', 'Flutter', 'Kubernetes', 'DevOps', 'Python', 'TypeScript'],
  }),
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: personJsonLD,
    },
  ],
})
</script>
