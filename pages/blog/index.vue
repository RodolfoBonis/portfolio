<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList :lang="lang" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead, useSeoMeta } from 'nuxt/app'

// Single source of truth for the blog list. @nuxtjs/i18n generates
// /en/blog automatically (prefix_except_default); locale below
// decides which language the API call pulls.
const { locale } = useI18n()
const lang = computed<'pt-BR' | 'en'>(() => (locale.value === 'en' ? 'en' : 'pt-BR'))

useSeoMeta({
  title: 'Blog — Rodolfo De Bonis',
  description: () =>
    locale.value === 'en'
      ? 'Technical notes, postmortems and experiments on Go, observability, multi-tenancy and infrastructure.'
      : 'Notas técnicas, postmortems e experimentos sobre Go, observabilidade, multi-tenancy e infraestrutura.',
  ogTitle: 'Blog — Rodolfo De Bonis',
  ogDescription: () =>
    locale.value === 'en'
      ? 'Technical articles on Go, distributed systems and DevOps.'
      : 'Artigos técnicos sobre Go, sistemas distribuídos e DevOps.',
  ogUrl: () =>
    locale.value === 'en'
      ? 'https://rodolfodebonis.com.br/en/blog'
      : 'https://rodolfodebonis.com.br/blog',
  ogType: 'website',
})

// useLocaleHead handles <html lang> + canonical + hreflang alternates
// automatically based on @nuxtjs/i18n's baseUrl + the route's
// localised paths. Replaces the manual link block we used to keep in
// sync across the PT + EN copies of this page.
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
