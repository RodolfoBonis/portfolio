<template>
  <Teleport to="body">
    <aside
      v-if="active"
      class="fixed top-0 left-0 right-0 z-[60] bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg"
    >
      <div class="section-container py-2 flex items-center justify-between gap-4 text-sm mono">
        <div class="flex items-center gap-2 truncate">
          <span class="material-icons text-base">visibility</span>
          <span class="font-semibold uppercase tracking-wider text-xs">preview</span>
          <span class="truncate">{{ message }}</span>
        </div>
        <a
          href="/preview/exit"
          class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:underline shrink-0"
        >
          {{ exitLabel }}
          <span class="material-icons text-sm">logout</span>
        </a>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
import { useRequestEvent } from 'nuxt/app'

// Active is decided server-side from the cookie. We render the banner
// during SSR so it shows on first paint without a hydration flicker.
// Reading via useRequestEvent keeps the cookie httpOnly (never reaches
// the browser-side script).
const event = useRequestEvent()
const cookieValue = computed(() => {
  if (!event) return null
  const cookie = event.node.req.headers?.cookie ?? ''
  const match = cookie.match(/(?:^|;\s*)preview_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
})

const active = computed(() => !!cookieValue.value)

const { locale } = useI18n()
const message = computed(() =>
  locale.value === 'en'
    ? 'Drafts visible until your token expires.'
    : 'Rascunhos visíveis até o token expirar.',
)
const exitLabel = computed(() => (locale.value === 'en' ? 'Exit' : 'Sair'))
</script>
