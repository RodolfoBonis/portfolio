<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogArticle :slug="slug" :lang="lang" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Single page file backs both /blog/<slug> (PT) and /en/blog/<slug>
// (EN) via @nuxtjs/i18n's prefix_except_default route generation.
// BlogArticle calls useSetI18nParams() internally so the header
// language switcher navigates to the matching translation's slug
// instead of reusing the PT slug at /en/blog/.
const { locale } = useI18n()
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const lang = computed<'pt-BR' | 'en'>(() => (locale.value === 'en' ? 'en' : 'pt-BR'))
</script>
