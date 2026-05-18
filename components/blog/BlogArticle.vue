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
          :href="tagHref(tag.slug)"
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
        <div class="flex flex-col text-sm flex-1">
          <span class="font-medium text-[var(--text-primary)]">{{ authorName }}</span>
          <span class="mono text-xs text-[var(--text-muted)]">
            {{ formattedDate }} · {{ data.reading_time_minutes }} min
            <template v-if="data.post.view_count > 0">
              · {{ data.post.view_count }} views
            </template>
          </span>
        </div>
        <button
          type="button"
          class="like-button"
          :class="{ 'is-liked': liked }"
          :aria-pressed="liked"
          :aria-label="liked ? copy.unlike : copy.like"
          :title="liked ? copy.unlike : copy.like"
          :disabled="likeBusy"
          @click="onLikeClick"
        >
          <span class="material-icons like-button__icon">
            {{ liked ? 'favorite' : 'favorite_border' }}
          </span>
          <span class="like-button__count">{{ likeCount }}</span>
        </button>
      </div>

      <!-- Cover (LCP element on the article route). Picture lets us
           ship an AVIF source first with WebP fallback; older
           browsers skip the type they can't parse without download. -->
      <NuxtPicture
        v-if="data.post.cover_image_url"
        :src="data.post.cover_image_url"
        :alt="translation?.title ?? ''"
        width="1600"
        height="900"
        sizes="(max-width: 768px) 100vw, 768px"
        format="avif,webp"
        quality="82"
        :img-attrs="{
          fetchpriority: 'high',
          decoding: 'async',
          class: 'w-full aspect-[16/9] object-cover rounded-2xl border border-[var(--border)] mb-12',
        }"
      />

      <!-- Body (server-rendered HTML) -->
      <BlogMarkdownContent :html="data.html" />

      <!-- Related (renders nothing if no shared-tag matches) -->
      <BlogRelatedPosts
        :tags="data.post.tags"
        :exclude="data.post.id"
        :lang="lang"
      />

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

      <!-- Comments — anonymous, validated via Cloudflare Turnstile,
           moderated server-side. The slug used here is the same one
           that resolved this page so the API can disambiguate per-
           language comment threads on bilingual posts. -->
      <BlogComments
        :post-slug="translation?.slug ?? slug"
        :lang="lang"
      />

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
import { computed, onMounted, ref, watch } from 'vue'
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
    ? {
        notFound: 'post not found',
        backToBlog: 'back to blog',
        like: 'Like this post',
        unlike: 'Unlike this post',
      }
    : {
        notFound: 'post não encontrado',
        backToBlog: 'voltar para o blog',
        like: 'Curtir post',
        unlike: 'Descurtir post',
      },
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

// Tag pills link to the per-tag page. Same lang prefix the post
// itself uses so we don't shuttle the user across language variants.
function tagHref(slug: string) {
  return props.lang === 'en'
    ? `/en/blog/tag/${slug}`
    : `/blog/tag/${slug}`
}

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

// Feed translation slugs into @nuxtjs/i18n's dynamic route params so
// the header language switcher (useSwitchLocalePath under setLocale)
// navigates to the matching translation's URL — `/blog/<pt-slug>`
// becomes `/en/blog/<en-slug>` instead of the same slug under /en.
// Re-runs whenever the post data changes (initial load + reactive
// updates). When the other-language translation doesn't exist, we
// fall back to the post's own slug so the switcher gracefully
// degrades to a 404 page instead of vanishing the navigation.
const ptSlug = computed(
  () =>
    data.value?.post?.translations?.find((t) => t.lang === 'pt-BR')?.slug ??
    props.slug,
)
const enSlug = computed(
  () =>
    data.value?.post?.translations?.find((t) => t.lang === 'en')?.slug ??
    props.slug,
)
// useSetI18nParams() is a *factory* — it returns the setter to call
// with the params, not a setter itself. Calling it with the params
// directly (a previous bug) registered nothing, so the switcher kept
// reusing the current slug under the new locale prefix.
const setI18nParams = useSetI18nParams()
const applyParams = () => {
  setI18nParams({
    'pt-BR': { slug: ptSlug.value },
    en: { slug: enSlug.value },
  })
}
applyParams()
watch([ptSlug, enSlug], applyParams)

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
    const links: Array<{
      rel: string
      hreflang?: string
      href: string
      as?: 'image'
      type?: string
      fetchpriority?: 'high'
    }> = [
      { rel: 'canonical', href: canonicalUrl.value },
      {
        rel: 'alternate',
        hreflang: props.lang === 'en' ? 'en' : 'pt-BR',
        href: canonicalUrl.value,
      },
    ]
    // Preload the LCP image as soon as the HTML lands so the
    // browser starts the fetch before discovering the <NuxtPicture>
    // markup. Cuts hundreds of ms off LCP on slow connections.
    const cover = data.value?.post?.cover_image_url
    if (cover) {
      links.push({
        rel: 'preload',
        as: 'image',
        href: cover,
        fetchpriority: 'high',
      })
    }
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
    // Strip HTML to feed schema.org `articleBody`. The crawler-facing
    // body doesn't need to be perfectly typeset — a regex strip is
    // sufficient and avoids pulling in a parser. The `data.html`
    // already came from the trusted server-render pipeline so we
    // don't worry about untrusted markup here either.
    const articleBody = (data.value.html || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    // The backend's reading_time_minutes is computed at write-time as
    // ceil(words / 200) so the inverse gives a stable wordCount
    // estimate without re-counting client-side.
    const wordCount = data.value.reading_time_minutes
      ? data.value.reading_time_minutes * 200
      : undefined
    const authorURL = 'https://rodolfodebonis.com.br/#about'
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
          articleBody,
          wordCount,
          commentCount: 0,
          author: {
            '@type': 'Person',
            name: post.author?.name || 'Rodolfo De Bonis',
            url: authorURL,
          },
          publisher: {
            '@type': 'Person',
            name: post.author?.name || 'Rodolfo De Bonis',
            url: authorURL,
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

// Likes — render from the SSR payload, then hydrate the per-IP `liked`
// flag on mount. The SSR response never sends X-Reader-State so the
// shared cache stays usable; the authoritative flag arrives one
// round-trip later via fetchReaderState.
const likeCount = ref(data.value?.post?.like_count ?? 0)
const liked = ref(false)
const likeBusy = ref(false)
// Keep the count in sync if the SSR payload swaps (route change between
// posts without a full reload).
watch(
  () => data.value?.post?.like_count,
  (next) => {
    if (typeof next === 'number') likeCount.value = next
  },
)

async function onLikeClick() {
  if (likeBusy.value) return
  likeBusy.value = true
  // Optimistic — invert + adjust count so the heart fills instantly.
  // Reconcile with the server response below; on error roll back.
  const prevLiked = liked.value
  const prevCount = likeCount.value
  liked.value = !prevLiked
  likeCount.value = Math.max(0, prevCount + (liked.value ? 1 : -1))
  try {
    const res = await useBlog().likePost(props.slug, props.lang)
    liked.value = res.liked
    likeCount.value = res.like_count
  } catch {
    liked.value = prevLiked
    likeCount.value = prevCount
  } finally {
    likeBusy.value = false
  }
}

// Best-effort view tracker (fire-and-forget) + authoritative liked flag.
onMounted(async () => {
  const blog = useBlog()
  blog.registerView(props.slug, props.lang)
  try {
    const state = await blog.fetchReaderState(props.slug, props.lang)
    liked.value = state.liked
    likeCount.value = state.like_count
  } catch {
    // Reader-state hydration is best-effort: the UI stays at the SSR
    // count + liked=false. The server is still the source of truth on
    // click (POST returns the canonical state).
  }
})
</script>

<style scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.like-button:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
}
.like-button:disabled {
  opacity: 0.6;
  cursor: progress;
}
.like-button.is-liked {
  color: var(--accent);
  border-color: var(--accent);
}
.like-button__icon {
  font-size: 1rem;
  line-height: 1;
}
.like-button__count {
  font-variant-numeric: tabular-nums;
}
</style>
