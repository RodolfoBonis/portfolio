<template>
  <section id="blog" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="mono text-[var(--accent)] text-sm">04.</span>
            <h2 class="text-3xl md:text-4xl font-bold">Últimas Postagens</h2>
          </div>
          <p class="text-[var(--text-muted)] max-w-2xl">
            Notas técnicas, postmortems e experimentos.
          </p>
        </div>
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm mono text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          Ver todos
          <span class="material-icons text-base">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Loading skeleton -->
      <div
        v-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in limit"
          :key="n"
          class="aspect-[4/5] rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse"
        ></div>
      </div>

      <!-- Error fallback: hide the section silently rather than break
           the home page if the blog API is down. -->
      <div v-else-if="error || !posts || posts.length === 0" class="hidden"></div>

      <!-- Cards -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :lang="lang"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAsyncData } from 'nuxt/app'
import { useBlog, type Lang, type BlogPost } from '~/composables/useBlog'

const props = withDefaults(
  defineProps<{
    lang?: Lang
    limit?: number
  }>(),
  {
    lang: 'pt-BR',
    limit: 3,
  },
)

const { data: posts, pending, error } = await useAsyncData<BlogPost[]>(
  `blog-latest-${props.lang}-${props.limit}`,
  () => useBlog().getLatest(props.lang, props.limit),
  {
    // Re-fetch when the home page revalidates (SWR handles this at the
    // route level; keep the composable cache-friendly).
    server: true,
    lazy: false,
    default: () => [],
  },
)
</script>
