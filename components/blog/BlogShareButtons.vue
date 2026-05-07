<template>
  <div class="flex items-center gap-2">
    <a
      :href="`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs mono text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      :aria-label="lang === 'en' ? 'Share on Twitter/X' : 'Compartilhar no Twitter/X'"
    >
      <span class="material-icons text-sm">share</span>
      Twitter / X
    </a>
    <a
      :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs mono text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      :aria-label="lang === 'en' ? 'Share on LinkedIn' : 'Compartilhar no LinkedIn'"
    >
      <span class="material-icons text-sm">share</span>
      LinkedIn
    </a>
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs mono text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      :aria-label="lang === 'en' ? 'Copy link' : 'Copiar link'"
      @click="copyLink"
    >
      <span class="material-icons text-sm">{{ copied ? 'check' : 'content_copy' }}</span>
      {{ copied ? copyLabel.copied : copyLabel.copy }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { Lang } from '~/composables/useBlog'

const props = defineProps<{
  url: string
  title: string
  lang?: Lang
}>()

const lang = computed<Lang>(() => props.lang ?? 'pt-BR')

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))

const copyLabel = computed(() =>
  lang.value === 'en'
    ? { copy: 'Copy link', copied: 'Copied!' }
    : { copy: 'Copiar link', copied: 'Copiado!' },
)

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Best-effort. If clipboard write fails (Safari permission edge
    // cases) the user can still copy from the address bar.
  }
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>
