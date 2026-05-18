<template>
  <section id="experience" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">04.</span>
        <h2 class="text-3xl md:text-4xl font-bold">{{ t('experience.section') }}</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        {{ t('experience.intro') }}
      </p>

      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-[var(--border)]"></div>

        <div class="space-y-2">
          <div
            v-for="(item, index) in timeline"
            :key="item.id ?? index"
            class="relative pl-12 md:pl-16 group"
          >
            <!-- Dot -->
            <div
              class="absolute left-2.5 md:left-4.5 top-6 w-3 h-3 rounded-full border-2 transition-colors"
              :class="item.current
                ? 'bg-[var(--accent)] border-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]'
                : 'bg-[var(--bg-primary)] border-[var(--border)] group-hover:border-[var(--accent)]'"
            ></div>

            <div class="py-4">
              <!-- Period -->
              <span class="mono text-xs text-[var(--accent)]">{{ item.period }}</span>

              <!-- Title (+ company suffix when present) -->
              <h3 class="text-lg font-semibold text-[var(--text-primary)] mt-1">
                {{ item.title }}<span v-if="item.company" class="text-[var(--text-muted)]"> — {{ item.company }}</span>
              </h3>

              <!-- Description (HTML pre-rendered from CMS markdown) -->
              <div
                v-if="item.description_html"
                class="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-2xl prose-exp"
                v-html="item.description_html"
              ></div>

              <!-- Key achievements -->
              <ul v-if="item.achievements?.length" class="mt-3 space-y-1">
                <li
                  v-for="achievement in item.achievements"
                  :key="achievement"
                  class="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                >
                  <span class="text-[var(--accent)] mt-0.5 text-xs">▹</span>
                  {{ achievement }}
                </li>
              </ul>

              <!-- Tech tags -->
              <div v-if="item.tech_tags?.length" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in item.tech_tags"
                  :key="tag"
                  class="px-2 py-0.5 text-[10px] mono rounded bg-[var(--accent-muted)] text-[var(--accent)]"
                >
                  {{ tag }}
                </span>
              </div>
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
  experiences: { type: Array, default: null },
})

const { t, locale } = useI18n()

const { data: fallback } = await useAsyncData(
  'experiences-fallback',
  () =>
    props.experiences
      ? Promise.resolve(props.experiences)
      : usePortfolio().getExperiences(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const list = computed(() => props.experiences ?? fallback.value ?? [])

// timeline maps the API shape onto the design's "period" string
// (always YYYY-YYYY with the localised "Atual"/"Present" word when
// the experience is current). The bullet uses `current` directly.
const timeline = computed(() => {
  const currentLabel = t('experience.periodCurrent')
  return list.value.map((item) => {
    const startYear = (item.period_start ?? '').slice(0, 4)
    const endYear = item.current
      ? currentLabel
      : (item.period_end ?? '').slice(0, 4) || currentLabel
    return {
      id: item.id,
      period: `${startYear} – ${endYear}`,
      title: item.title,
      company: item.company,
      description_html: item.description_html,
      achievements: item.achievements ?? [],
      tech_tags: item.tech_tags ?? [],
      current: item.current,
    }
  })
})
</script>

<style scoped>
.prose-exp :deep(p) {
  margin: 0 0 0.5rem;
}
.prose-exp :deep(p:last-child) {
  margin-bottom: 0;
}
.prose-exp :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}
</style>
