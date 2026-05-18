<template>
  <section id="stacks" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">02.</span>
        <h2 class="text-3xl md:text-4xl font-bold">{{ t('stacks.section') }}</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        {{ t('stacks.intro') }}
      </p>

      <!-- Categories -->
      <div class="space-y-12">
        <div v-for="category in categories" :key="category.id">
          <h3 class="text-sm mono text-[var(--accent)] mb-6 flex items-center gap-2">
            <span class="material-icons text-base">{{ categoryIcon(category.slug) }}</span>
            {{ category.name }}
          </h3>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div
              v-for="stack in category.items"
              :key="stack.id"
              class="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover-lift cursor-default"
            >
              <img
                v-if="stack.icon_path"
                :src="stack.icon_path"
                :alt="stack.name"
                class="w-10 h-10 transition-transform group-hover:scale-110"
              />
              <span class="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-center">
                {{ stack.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { usePortfolio } from '~/composables/usePortfolio'

const props = defineProps({
  stacks: { type: Array, default: null },
})

const { t, locale } = useI18n()

const { data: fallback } = await useAsyncData(
  'stacks-fallback',
  () =>
    props.stacks
      ? Promise.resolve(props.stacks)
      : usePortfolio().getStacks(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const categories = computed(() => props.stacks ?? fallback.value ?? [])

// Maps category slugs to material-icons names. Falls back to a
// generic "label" icon so a new category slug created in the admin
// renders without a code change. Adding a custom icon per slug is
// a follow-up if the four seed categories ever grow.
function categoryIcon(slug) {
  switch (slug) {
    case 'backend':
      return 'terminal'
    case 'frontend':
      return 'devices'
    case 'devops':
      return 'cloud'
    case 'data':
      return 'storage'
    default:
      return 'label'
  }
}
</script>
