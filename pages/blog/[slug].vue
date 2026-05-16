<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogArticle :slug="slug" lang="pt-BR" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Blog routes are managed manually (see /pages/en/blog/[slug].vue);
// keep @nuxtjs/i18n out of them so existing PT slugs stay at /blog/...
defineI18nRoute({ locales: false })

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
</script>
