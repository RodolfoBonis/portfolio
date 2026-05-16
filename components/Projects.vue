<template>
  <section id="projects" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">03.</span>
        <h2 class="text-3xl md:text-4xl font-bold">{{ t('projects.section') }}</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        {{ t('projects.intro') }}
      </p>

      <div class="space-y-8">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300"
        >
          <div class="grid md:grid-cols-5 gap-0">
            <!-- Image -->
            <div class="md:col-span-2 relative overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full min-h-[200px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--surface)] hidden md:block"></div>
            </div>

            <!-- Content -->
            <div class="md:col-span-3 p-8 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-3">
                <span class="mono text-xs text-[var(--accent)]">{{ String(index + 1).padStart(2, '0') }}</span>
                <h3 class="text-2xl font-bold text-[var(--text-primary)]">{{ project.title }}</h3>
              </div>

              <p class="text-[var(--text-secondary)] mb-6 leading-relaxed">
                {{ project.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-3 py-1 text-xs mono rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Highlights -->
              <ul v-if="project.highlights && project.highlights.length" class="space-y-2 mb-6">
                <li
                  v-for="highlight in project.highlights"
                  :key="highlight"
                  class="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span class="text-[var(--accent)] mt-0.5">▹</span>
                  {{ highlight }}
                </li>
              </ul>

              <!-- Actions -->
              <div class="flex gap-4">
                <a
                  :href="project.githubUrl"
                  target="_blank"
                  class="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
                >
                  <span class="material-icons text-base">code</span>
                  {{ t('projects.viewSource') }}
                  <span class="material-icons text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { projectsMeta } from '~/data/projects'

const { t, tm, locale } = useI18n()

// projects merges the locale-specific copy (title, description,
// highlights) with the locale-neutral meta (image, tags, githubUrl).
// Iteration order follows the i18n array so the locale file controls
// what shows up and in what order. Re-runs when locale flips so the
// EN visitor gets EN copy without a route reload.
//
// `locale` is referenced inside the computation so Vue tracks the
// dependency — without it, switching language wouldn't trigger a
// re-render of the cards.
const projects = computed(() => {
  void locale.value
  const localized = tm('projects.items') ?? []
  const byId = new Map(projectsMeta.map((p) => [p.id, p]))
  return localized
    .map((item) => {
      const meta = byId.get(item.id)
      if (!meta) return null
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        highlights: item.highlights ?? [],
        image: meta.image,
        tags: meta.tags,
        githubUrl: meta.githubUrl,
      }
    })
    .filter(Boolean)
})
</script>
