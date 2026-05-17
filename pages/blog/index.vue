<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList lang="pt-BR" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from 'nuxt/app'

// Opt out of @nuxtjs/i18n route generation. The blog already has its
// own /blog (PT) + /en/blog (EN) pair via duplicated page files; we
// don't want the module to add /en/blog/<slug> pointing back to this
// one. Same trick on every other blog page below.
defineI18nRoute(false)

useSeoMeta({
  title: 'Blog — Rodolfo De Bonis',
  description:
    'Notas técnicas, postmortems e experimentos sobre Go, observabilidade, multi-tenancy e infraestrutura.',
  ogTitle: 'Blog — Rodolfo De Bonis',
  ogDescription:
    'Artigos técnicos sobre Go, sistemas distribuídos e DevOps.',
  ogUrl: 'https://rodolfodebonis.com.br/blog',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://rodolfodebonis.com.br/blog' },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://rodolfodebonis.com.br/en/blog',
    },
    {
      rel: 'alternate',
      hreflang: 'pt-BR',
      href: 'https://rodolfodebonis.com.br/blog',
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://rodolfodebonis.com.br/blog',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: 'https://rodolfodebonis.com.br/feed.xml',
      title: 'Rodolfo De Bonis — Blog',
    },
  ],
})
</script>
