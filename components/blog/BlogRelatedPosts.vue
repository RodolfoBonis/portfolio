<template>
  <section v-if="related.length > 0" class="mt-16 pt-10 border-t border-[var(--border)]">
    <h2 class="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
      <span class="mono text-[var(--accent)] text-sm">›</span>
      {{ heading }}
    </h2>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BlogCard
        v-for="post in related"
        :key="post.id"
        :post="post"
        :lang="lang"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { useBlog, type BlogPost, type BlogTag, type Lang } from '~/composables/useBlog'

const props = defineProps<{
  tags: BlogTag[] | undefined
  exclude: string
  lang: Lang
}>()

const heading = computed(() =>
  props.lang === 'en' ? 'Continue reading' : 'Continue lendo',
)

const primaryTag = computed(() => props.tags?.[0]?.slug ?? '')

// Fetch when there's a tag to scope on. Without a tag we'd just get
// the latest list which is exactly what /blog already shows on the
// previous page — better to render nothing than be redundant.
const { data } = await useAsyncData<BlogPost[]>(
  () => `blog-related-${props.exclude}-${props.lang}-${primaryTag.value}`,
  async () => {
    if (!primaryTag.value) return []
    const res = await useBlog().getList({
      lang: props.lang,
      tag: primaryTag.value,
      per_page: 4,
    })
    return res.items ?? []
  },
  {
    server: true,
    default: () => [],
    watch: [primaryTag],
  },
)

const related = computed(() => {
  const items = data.value ?? []
  return items.filter((p) => p.id !== props.exclude).slice(0, 3)
})
</script>
