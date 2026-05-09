<template>
  <div class="section-container py-32">
    <!-- Hero -->
    <header class="mb-12">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">04.</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          {{ copy.title }}
        </h1>
      </div>
      <p class="text-lg text-[var(--text-secondary)] max-w-2xl">
        {{ copy.description }}
      </p>
    </header>

    <!-- Filters -->
    <div class="space-y-4 mb-10">
      <BlogSearchBar v-model="search" :placeholder="copy.searchPlaceholder" :lang="lang" />

      <div v-if="tagsList.length > 0" class="flex flex-wrap gap-2">
        <button
          type="button"
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-md text-xs mono transition-colors',
            !activeTag
              ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/40'
              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]',
          ]"
          @click="activeTag = ''"
        >
          #{{ copy.allTag }}
        </button>
        <button
          v-for="tag in tagsList"
          :key="tag.id"
          type="button"
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-md text-xs mono transition-colors',
            activeTag === tag.slug
              ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/40'
              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]',
          ]"
          @click="activeTag = activeTag === tag.slug ? '' : tag.slug"
        >
          #{{ tag.slug }}
          <span v-if="tag.post_count" class="ml-1.5 text-[10px] opacity-70">
            {{ tag.post_count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="aspect-[4/5] rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse"
      ></div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!data || data.items.length === 0"
      class="text-center py-24 border border-[var(--border)] rounded-2xl bg-[var(--surface)]"
    >
      <p class="text-[var(--text-muted)] mono">// {{ copy.empty }}</p>
    </div>

    <!-- Cards grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <BlogCard
        v-for="post in data.items"
        :key="post.id"
        :post="post"
        :lang="lang"
      />
    </div>

    <!-- Pagination — minimal: prev/next + page count -->
    <div
      v-if="data && data.total > data.page_size"
      class="flex items-center justify-center gap-3 mt-12 mono text-sm text-[var(--text-muted)]"
    >
      <button
        type="button"
        class="px-3 py-1.5 rounded-md border border-[var(--border)] disabled:opacity-40 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        :disabled="page <= 1"
        @click="page = Math.max(1, page - 1)"
      >
        ‹
      </button>
      <span>
        // page {{ page }} of {{ Math.max(1, Math.ceil(data.total / data.page_size)) }}
      </span>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md border border-[var(--border)] disabled:opacity-40 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        :disabled="page * data.page_size >= data.total"
        @click="page = page + 1"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { useBlog, type Lang, type BlogListResponse } from '~/composables/useBlog'

const props = defineProps<{
  lang: Lang
  // Pre-applied tag filter (used by /blog/tag/[slug] routes). Users
  // can still toggle to other tags via the chip row, so this is a
  // starting point not a hard scope.
  initialTag?: string
}>()

const search = ref('')
const activeTag = ref(props.initialTag ?? '')
const page = ref(1)

const copy = computed(() => {
  if (props.lang === 'en') {
    return {
      title: 'Technical notes, postmortems, experiments.',
      description:
        'Articles on Go, observability, multi-tenancy, infrastructure — everything I learn building production systems.',
      searchPlaceholder: 'grep "term" ./posts',
      allTag: 'all',
      empty: 'no posts found',
    }
  }
  return {
    title: 'Notas técnicas, postmortems, experimentos.',
    description:
      'Artigos sobre Go, observabilidade, multi-tenancy, infraestrutura — tudo que aprendo construindo sistemas em produção.',
    searchPlaceholder: 'grep "termo" ./posts',
    allTag: 'todos',
    empty: 'nenhum post encontrado',
  }
})

// Reset page when filters change so the user always lands on page 1
// of a refreshed result set.
watch([search, activeTag], () => {
  page.value = 1
})

const filterKey = computed(
  () => `blog-list-${props.lang}-${search.value}-${activeTag.value}-${page.value}`,
)

const { data, pending } = await useAsyncData<BlogListResponse>(
  filterKey,
  () =>
    useBlog().getList({
      lang: props.lang,
      q: search.value || undefined,
      tag: activeTag.value || undefined,
      page: page.value,
      per_page: 9,
    }),
  {
    server: true,
    watch: [search, activeTag, page],
    default: () => ({ items: [], page: 1, page_size: 9, total: 0 }),
  },
)

// Tags list — fetched once, used for filter chips. Errors hide the
// chips silently rather than breaking the page.
const { data: tagsData } = await useAsyncData(
  `blog-tags-${props.lang}`,
  () => useBlog().getTags(),
  {
    server: true,
    default: () => [],
  },
)
const tagsList = computed(() => tagsData.value ?? [])
</script>
