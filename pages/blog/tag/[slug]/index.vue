<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList :lang="lang" :initial-tag="slug" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useSeoMeta, useHead } from 'nuxt/app'

// Tag slugs are locale-neutral on the API side (same slug regardless
// of language), so a single page file backs /blog/tag/:slug and
// /en/blog/tag/:slug without slug param mapping.
const { locale } = useI18n()
const route = useRoute()
const slug = (route.params.slug as string) ?? ''
const lang = computed<'pt-BR' | 'en'>(() => (locale.value === 'en' ? 'en' : 'pt-BR'))

useSeoMeta({
  title: () => `Blog · #${slug} — Rodolfo De Bonis`,
  description: () =>
    locale.value === 'en'
      ? `Posts tagged #${slug}. Technical notes, postmortems and experiments.`
      : `Posts marcados com #${slug}. Notas técnicas, postmortems e experimentos.`,
  ogTitle: `Blog · #${slug} — Rodolfo De Bonis`,
  ogDescription: () =>
    locale.value === 'en' ? `Posts tagged #${slug}.` : `Posts marcados com #${slug}.`,
  ogUrl: () =>
    locale.value === 'en'
      ? `https://rodolfodebonis.com.br/en/blog/tag/${slug}`
      : `https://rodolfodebonis.com.br/blog/tag/${slug}`,
  ogType: 'website',
})

useLocaleHead({ addSeoAttributes: true })

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: 'https://rodolfodebonis.com.br/feed.xml',
      title: 'Rodolfo De Bonis — Blog',
    },
  ],
})
</script>
