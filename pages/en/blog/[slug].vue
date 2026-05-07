<template>
  <div>
    <MainHeader />
    <main class="min-h-screen">
      <BlogArticle :slug="slug" lang="en" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
</script>
