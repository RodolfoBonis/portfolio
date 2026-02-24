<template>
  <section id="projects" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">03.</span>
        <h2 class="text-3xl md:text-4xl font-bold">Projetos em Destaque</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        Alguns projetos que refletem meu trabalho e interesses
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
              <ul v-if="project.highlights" class="space-y-2 mb-6">
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
                  Código fonte
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
const projects = [
  {
    id: 'hermes',
    title: 'Hermes',
    description:
      'Sistema de notificações unificado que gerencia Push, WhatsApp, Telegram e Slack com segmentação inteligente por tags e retry automático.',
    image: '/api/cdn/portfolio/hermes.png',
    tags: ['Go', 'Flutter', 'Kafka', 'RabbitMQ', 'K3s', 'Vault'],
    highlights: [
      'Multi-tenant sem vazamento de dados entre clientes',
      'Latência < 200ms para notificações push críticas',
      'Monitoramento via Prometheus + Grafana',
    ],
    githubUrl: 'https://github.com/RodolfoBonis/hermes',
  },
  {
    id: 'microdetect',
    title: 'MicroDetect',
    description:
      'Sistema de visão computacional para classificação e contagem de leveduras. TCC com YOLOv8 para detecção, FastAPI como backend e Flutter para interface Desktop.',
    image: '/api/cdn/portfolio/microdetect.png',
    tags: ['Python', 'YOLOv8', 'FastAPI', 'Flutter'],
    highlights: [
      'Dataset de microscopia com 1.200+ imagens anotadas manualmente',
      'Gráficos de contagem em tempo real via Flutter Desktop',
    ],
    githubUrl: 'https://github.com/RodolfoBonis/microdetect',
  },
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    description:
      'Este portfólio! Construído com Nuxt 3 e Tailwind CSS. Design industrial com estética de terminal, deploy automatizado via GitHub Actions + ArgoCD.',
    image: '/api/cdn/portfolio/portfolio-pessoal.png',
    tags: ['Nuxt 3', 'Tailwind CSS', 'TypeScript', 'ArgoCD'],
    highlights: [
      'SSR com Nuxt 3 para SEO otimizado',
      'Dark/Light mode com persistência',
      'CI/CD automatizado end-to-end',
    ],
    githubUrl: 'https://github.com/RodolfoBonis/portfolio',
  },
]
</script>
