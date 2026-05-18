<template>
  <NuxtLink
    :to="link"
    class="group block bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col"
  >
    <!-- Cover -->
    <div class="aspect-[16/9] bg-[var(--bg-tertiary)] overflow-hidden">
      <NuxtImg
        v-if="post.cover_image_url"
        :src="post.cover_image_url"
        :alt="title"
        width="800"
        height="450"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        format="avif,webp"
        quality="78"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs mono"
      >
        // sem cover
      </div>
    </div>

    <!-- Body -->
    <div class="p-6 flex-1 flex flex-col gap-3">
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1.5">
        <BlogTagPill
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag.id"
          :label="tag.slug"
        />
      </div>

      <h3 class="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
        {{ title }}
      </h3>

      <p
        v-if="excerpt"
        class="text-sm text-[var(--text-secondary)] line-clamp-3 flex-1"
      >
        {{ excerpt }}
      </p>

      <!-- Meta -->
      <div class="flex items-center gap-2 text-xs mono text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
        <time :datetime="post.published_at ?? post.created_at">
          {{ formattedDate }}
        </time>
        <span>·</span>
        <span>{{ post.reading_time_minutes }} min</span>
        <span v-if="post.view_count > 0">·</span>
        <span v-if="post.view_count > 0" class="flex items-center gap-1">
          <span class="material-icons text-[12px]">visibility</span>
          {{ formatViews(post.view_count) }}
        </span>
        <template v-if="(post.like_count ?? 0) > 0">
          <span>·</span>
          <span class="flex items-center gap-1">
            <span class="material-icons text-[12px]">favorite_border</span>
            {{ formatViews(post.like_count) }}
          </span>
        </template>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { pickTranslation, type BlogPost, type Lang } from '~/composables/useBlog'

const props = defineProps<{
  post: BlogPost
  lang?: Lang
}>()

const lang = computed<Lang>(() => props.lang ?? 'pt-BR')

const translation = computed(() => pickTranslation(props.post, lang.value))

const title = computed(() => translation.value?.title ?? '—')
const excerpt = computed(() => translation.value?.excerpt ?? '')

// Build the link using the translation that actually provided the slug.
// If EN is missing, we fall back to PT route (/blog/...) instead of
// incorrectly forcing /en/blog/... with a PT slug.
const link = computed(() => {
  const selected = props.post.translations?.find((t) => t.lang === lang.value)
  const fallback = props.post.translations?.find((t) => t.lang === 'pt-BR') ?? props.post.translations?.[0]
  const target = selected ?? fallback
  const slug = target?.slug
  if (!slug) return '/blog'
  return target?.lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`
})

const formattedDate = computed(() => {
  const iso = props.post.published_at ?? props.post.created_at
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(lang.value === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

function formatViews(n: number): string {
  if (n < 1000) return String(n)
  return (n / 1000).toFixed(1) + 'k'
}
</script>
