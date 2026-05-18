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
                v-if="project.image_url"
                :src="project.image_url"
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

              <!-- description_html arrives sanitised from the CMS
                   (goldmark pipeline, no scripts / inline styles) so
                   v-html is safe here. -->
              <div
                v-if="project.description_html"
                class="text-[var(--text-secondary)] mb-6 leading-relaxed prose-project"
                v-html="project.description_html"
              ></div>

              <!-- Tags -->
              <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-3 py-1 text-xs mono rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Highlights -->
              <ul v-if="project.highlights?.length" class="space-y-2 mb-6">
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
                  v-if="project.github_url"
                  :href="project.github_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
                >
                  <span class="material-icons text-base">code</span>
                  {{ t('projects.viewSource') }}
                  <span class="material-icons text-sm">open_in_new</span>
                </a>
                <a
                  v-if="project.live_url"
                  :href="project.live_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
                >
                  <span class="material-icons text-base">open_in_new</span>
                  Live
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
import { usePortfolio } from '~/composables/usePortfolio'

const props = defineProps({
  // pages/index.vue can pre-fetch the array; falls back to a fresh
  // call if dropped into a page that doesn't provide it.
  projects: { type: Array, default: null },
})

const { t, locale } = useI18n()

const { data: fallback } = await useAsyncData(
  'projects-fallback',
  () =>
    props.projects
      ? Promise.resolve(props.projects)
      : usePortfolio().getProjects(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const projects = computed(() => props.projects ?? fallback.value ?? [])
</script>

<style scoped>
.prose-project :deep(p) {
  margin: 0 0 0.75rem;
}
.prose-project :deep(p:last-child) {
  margin-bottom: 0;
}
.prose-project :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}
.prose-project :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}
</style>
