<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList lang="en" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from 'nuxt/app'

defineI18nRoute(false)

useSeoMeta({
  title: 'Blog — Rodolfo De Bonis',
  description:
    'Technical notes, postmortems and experiments on Go, observability, multi-tenancy and infrastructure.',
  ogTitle: 'Blog — Rodolfo De Bonis',
  ogDescription:
    'Technical articles on Go, distributed systems and DevOps.',
  ogUrl: 'https://rodolfodebonis.com.br/en/blog',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: 'https://rodolfodebonis.com.br/en/blog' },
    {
      rel: 'alternate',
      hreflang: 'pt-BR',
      href: 'https://rodolfodebonis.com.br/blog',
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://rodolfodebonis.com.br/en/blog',
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
