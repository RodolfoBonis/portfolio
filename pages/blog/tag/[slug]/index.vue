<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList lang="pt-BR" :initial-tag="slug" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useSeoMeta, useHead } from 'nuxt/app'

const route = useRoute()
const slug = (route.params.slug as string) ?? ''

useSeoMeta({
  title: `Blog · #${slug} — Rodolfo De Bonis`,
  description: `Posts marcados com #${slug}. Notas técnicas, postmortems e experimentos.`,
  ogTitle: `Blog · #${slug} — Rodolfo De Bonis`,
  ogDescription: `Posts marcados com #${slug}.`,
  ogUrl: `https://rodolfodebonis.com.br/blog/tag/${slug}`,
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: `https://rodolfodebonis.com.br/blog/tag/${slug}` },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `https://rodolfodebonis.com.br/en/blog/tag/${slug}`,
    },
    {
      rel: 'alternate',
      hreflang: 'pt-BR',
      href: `https://rodolfodebonis.com.br/blog/tag/${slug}`,
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
