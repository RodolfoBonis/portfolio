<template>
  <div>
    <MainHeader />
    <main>
      <Hero />
      <About />
      <Stacks />
      <Projects />
      <Experience />
      <Contact />
    </main>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rodolfo De Bonis — Software Engineer',
  description: 'Engenheiro de Software com 8+ anos de experiência em Go, Flutter, Kubernetes e DevOps. Transformando ideias complexas em sistemas que simplesmente funcionam.',
  ogTitle: 'Rodolfo De Bonis — Software Engineer',
  ogDescription: 'Engenheiro de Software | DevOps | Mobile | D&D Master',
  ogImage: 'https://rodolfodebonis.com.br/api/cdn/portfolio/me.jpeg',
  ogUrl: 'https://rodolfodebonis.com.br',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// JSON-LD structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Rodolfo De Bonis',
        url: 'https://rodolfodebonis.com.br',
        jobTitle: 'Software Engineer',
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
    },
  ],
})
</script>
