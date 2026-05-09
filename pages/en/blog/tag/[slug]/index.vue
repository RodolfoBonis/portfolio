<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogList lang="en" :initial-tag="slug" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useSeoMeta, useHead } from 'nuxt/app'

const route = useRoute()
const slug = (route.params.slug as string) ?? ''

useSeoMeta({
  title: `Blog · #${slug} — Rodolfo De Bonis`,
  description: `Posts tagged #${slug}. Technical notes, postmortems and experiments.`,
  ogTitle: `Blog · #${slug} — Rodolfo De Bonis`,
  ogDescription: `Posts tagged #${slug}.`,
  ogUrl: `https://rodolfodebonis.com.br/en/blog/tag/${slug}`,
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: `https://rodolfodebonis.com.br/en/blog/tag/${slug}` },
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
