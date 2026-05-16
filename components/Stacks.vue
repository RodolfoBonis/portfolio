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
        <div v-for="category in categories" :key="category.name">
          <h3 class="text-sm mono text-[var(--accent)] mb-6 flex items-center gap-2">
            <span class="material-icons text-base">{{ category.icon }}</span>
            {{ category.name }}
          </h3>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div
              v-for="stack in category.items"
              :key="stack.name"
              class="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover-lift cursor-default"
            >
              <img
                :src="stack.icon"
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
const { t } = useI18n()
const icon = (name) => `/icons/${name}.svg`

// Only the category heading is localised — stack names are
// brand/product names and stay neutral across locales.
const categories = computed(() => [
  {
    name: t('stacks.categories.backend'),
    icon: 'terminal',
    items: [
      { name: 'Go', icon: icon('go') },
      { name: 'Python', icon: icon('python') },
      { name: 'FastAPI', icon: icon('fastapi') },
      { name: 'Node.js', icon: icon('nuxt') },
    ],
  },
  {
    name: t('stacks.categories.frontend'),
    icon: 'devices',
    items: [
      { name: 'Flutter', icon: icon('flutter') },
      { name: 'Vue.js', icon: icon('vue') },
      { name: 'Nuxt 3', icon: icon('nuxt') },
      { name: 'Angular', icon: icon('angular') },
      { name: 'Swift', icon: icon('swift') },
      { name: 'Android', icon: icon('android') },
      { name: 'Ionic', icon: icon('ionic') },
    ],
  },
  {
    name: t('stacks.categories.devops'),
    icon: 'cloud',
    items: [
      { name: 'K3s', icon: icon('kubernetes') },
      { name: 'Docker', icon: icon('docker') },
      { name: 'Terraform', icon: icon('terraform') },
      { name: 'ArgoCD', icon: icon('argocd') },
      { name: 'AWS', icon: icon('aws') },
      { name: 'Vault', icon: icon('vault') },
      { name: 'GitHub Actions', icon: icon('github-actions') },
    ],
  },
  {
    name: t('stacks.categories.data'),
    icon: 'storage',
    items: [
      { name: 'PostgreSQL', icon: icon('postgresql') },
      { name: 'Redis', icon: icon('redis') },
      { name: 'Elastic', icon: icon('elasticsearch') },
      { name: 'MinIO', icon: icon('minio') },
      { name: 'SonarQube', icon: icon('sonarqube') },
      { name: 'n8n', icon: icon('n8n') },
    ],
  },
])
</script>
