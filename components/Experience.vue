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

              <!-- Title -->
              <h3 class="text-lg font-semibold text-[var(--text-primary)] mt-1">
                {{ item.title }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-2xl">
                {{ item.description }}
              </p>

              <!-- Key achievements -->
              <ul v-if="item.achievements && item.achievements.length" class="mt-3 space-y-1">
                <li
                  v-for="achievement in item.achievements"
                  :key="achievement"
                  class="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                >
                  <span class="text-[var(--accent)] mt-0.5 text-xs">▹</span>
                  {{ achievement }}
                </li>
              </ul>

              <!-- Tags -->
              <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in item.tags"
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
import { experienceMeta } from '~/data/experience'

const { t, tm, locale } = useI18n()

// timeline rebuilds the period string from periodStart/periodEnd in
// the locale ("2017") + the localised `periodCurrent` label
// ("Atual" / "Present") so dates render natively per language. Tags
// + `current` flag stay neutral via the data file merge — same
// pattern Projects.vue uses.
const timeline = computed(() => {
  void locale.value
  const currentLabel = t('experience.periodCurrent')
  const localized = tm('experience.timeline') ?? []
  const byId = new Map(experienceMeta.map((e) => [e.id, e]))
  return localized
    .map((item) => {
      const meta = byId.get(item.id) ?? { id: item.id }
      const periodEnd = meta.current ? currentLabel : item.periodEnd ?? currentLabel
      return {
        id: item.id,
        period: `${item.periodStart} – ${periodEnd}`,
        title: item.title,
        description: item.description,
        achievements: item.achievements ?? [],
        current: !!meta.current,
        tags: meta.tags ?? [],
      }
    })
})
</script>
