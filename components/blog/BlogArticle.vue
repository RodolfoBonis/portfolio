<template>
  <article class="section-container py-32 max-w-3xl">
    <!-- 404 -->
    <div v-if="error" class="text-center py-24">
      <p class="mono text-[var(--text-muted)] mb-4">// {{ copy.notFound }}</p>
      <NuxtLink
        :to="lang === 'en' ? '/en/blog' : '/blog'"
        class="inline-flex items-center gap-2 text-[var(--accent)] mono hover:underline"
      >
        ← {{ copy.backToBlog }}
      </NuxtLink>
    </div>

    <template v-else-if="data?.post">
      <!-- Breadcrumb / back -->
      <div class="mb-8 flex items-center gap-2 mono text-sm text-[var(--text-muted)]">
        <span class="text-[var(--accent)]">❯</span>
        <span>cd</span>
        <NuxtLink
          :to="lang === 'en' ? '/en/blog' : '/blog'"
          class="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          ~/blog
        </NuxtLink>
      </div>

      <!-- Tags -->
      <div
        v-if="data.post.tags && data.post.tags.length > 0"
        class="flex flex-wrap gap-2 mb-6"
      >
        <BlogTagPill
          v-for="tag in data.post.tags"
          :key="tag.id"
          :label="tag.slug"
        />
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-6">
        {{ translation?.title }}
      </h1>

      <!-- Author + meta -->
      <div class="flex items-center gap-3 mb-10 pb-10 border-b border-[var(--border)]">
        <div
          class="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center font-bold text-sm"
        >
          {{ authorInitials }}
        </div>
        <div class="flex flex-col text-sm">
          <span class="font-medium text-[var(--text-primary)]">{{ authorName }}</span>
          <span class="mono text-xs text-[var(--text-muted)]">
            {{ formattedDate }} · {{ data.reading_time_minutes }} min
            <template v-if="data.post.view_count > 0">
              · {{ data.post.view_count }} views
            </template>
          </span>
        </div>
      </div>

      <!-- Cover -->
      <img
        v-if="data.post.cover_image_url"
        :src="data.post.cover_image_url"
        :alt="translation?.title ?? ''"
        class="w-full aspect-[16/9] object-cover rounded-2xl border border-[var(--border)] mb-12"
      />

      <!-- Body (server-rendered HTML) -->
      <BlogMarkdownContent :html="data.html" />

      <!-- Share -->
      <div class="mt-16 pt-8 border-t border-[var(--border)]">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <span class="mono text-xs text-[var(--text-muted)]">// share</span>
          <BlogShareButtons
            :url="canonicalUrl"
            :title="translation?.title ?? ''"
            :lang="lang"
          />
        </div>
      </div>

      <!-- Back -->
      <div class="mt-12">
        <NuxtLink
          :to="lang === 'en' ? '/en/blog' : '/blog'"
          class="inline-flex items-center gap-2 text-[var(--accent)] mono text-sm hover:underline"
        >
          ← {{ copy.backToBlog }}
        </NuxtLink>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAsyncData, useHead, useSeoMeta } from 'nuxt/app'
import {
  pickTranslation,
  useBlog,
  type Lang,
  type BlogPost,
  type PostTranslation,
} from '~/composables/useBlog'

const props = defineProps<{
  slug: string
  lang: Lang
}>()

const copy = computed(() =>
  props.lang === 'en'
    ? { notFound: 'post not found', backToBlog: 'back to blog' }
    : { notFound: 'post não encontrado', backToBlog: 'voltar para o blog' },
)

const { data, error } = await useAsyncData<{
  post: BlogPost
  html: string
  reading_time_minutes: number
}>(
  `blog-article-${props.lang}-${props.slug}`,
  () =>
    $fetch(`/api/blog/render/${props.slug}`, {
      query: { lang: props.lang },
    }),
  {
    server: true,
  },
)

const translation = computed<PostTranslation | undefined>(() =>
  data.value?.post ? pickTranslation(data.value.post, props.lang) : undefined,
)

// Author display: snapshotted at publish-time on the API side
// (`post.author.name`). Empty fallback keeps SSR happy if the API
// shape ever drifts; the avatar derives initials from the name so a
// rename in Keycloak shows up the next time the post is republished.
const authorName = computed(() => data.value?.post?.author?.name ?? '')

const authorInitials = computed(() => {
  const name = authorName.value.trim()
  if (!name) return '?'
  const parts = name.split(/\s+/).slice(0, 2)
  return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?'
})

const canonicalUrl = computed(() => {
  const path =
    props.lang === 'en' ? `/en/blog/${props.slug}` : `/blog/${props.slug}`
  return `https://rodolfodebonis.com.br${path}`
})

const altPath = computed(() => {
  // Cross-language URL: read the *other* language's translation slug
  // from the post if present; otherwise omit the alternate.
  const otherLang: Lang = props.lang === 'en' ? 'pt-BR' : 'en'
  const otherSlug = data.value?.post?.translations?.find(
    (t) => t.lang === otherLang,
  )?.slug
  if (!otherSlug) return null
  return otherLang === 'en' ? `/en/blog/${otherSlug}` : `/blog/${otherSlug}`
})

const formattedDate = computed(() => {
  const iso = data.value?.post?.published_at ?? data.value?.post?.created_at
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(props.lang === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

// SEO: per-article title/description/og + JSON-LD Article + hreflang.
useSeoMeta({
  title: () => translation.value?.seo_title || translation.value?.title || '',
  description: () =>
    translation.value?.seo_description || translation.value?.excerpt || '',
  ogTitle: () => translation.value?.title || '',
  ogDescription: () =>
    translation.value?.seo_description || translation.value?.excerpt || '',
  ogImage: () => data.value?.post?.cover_image_url || undefined,
  ogUrl: () => canonicalUrl.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: { lang: props.lang === 'en' ? 'en' : 'pt-BR' },
  link: () => {
    const links: Array<{ rel: string; hreflang?: string; href: string }> = [
      { rel: 'canonical', href: canonicalUrl.value },
      {
        rel: 'alternate',
        hreflang: props.lang === 'en' ? 'en' : 'pt-BR',
        href: canonicalUrl.value,
      },
    ]
    if (altPath.value) {
      const alt = `https://rodolfodebonis.com.br${altPath.value}`
      links.push({
        rel: 'alternate',
        hreflang: props.lang === 'en' ? 'pt-BR' : 'en',
        href: alt,
      })
      links.push({
        rel: 'alternate',
        hreflang: 'x-default',
        href: alt,
      })
    } else {
      links.push({ rel: 'alternate', hreflang: 'x-default', href: canonicalUrl.value })
    }
    return links
  },
  script: () => {
    if (!data.value?.post || !translation.value) return []
    const post = data.value.post
    const t = translation.value
    return [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: t.title,
          description: t.seo_description || t.excerpt || '',
          image: post.cover_image_url || undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          inLanguage: props.lang,
          author: {
            '@type': 'Person',
            name: post.author?.name || 'Rodolfo De Bonis',
            url: 'https://rodolfodebonis.com.br',
          },
          publisher: {
            '@type': 'Person',
            name: post.author?.name || 'Rodolfo De Bonis',
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl.value,
          },
          keywords: post.tags?.map((tag) => tag.slug).join(', '),
        }),
      },
    ]
  },
})

// Best-effort view tracker (fire-and-forget).
onMounted(() => {
  useBlog().registerView(props.slug, props.lang)
})
</script>
