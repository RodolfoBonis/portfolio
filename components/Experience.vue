<template>
  <section id="experience" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">04.</span>
        <h2 class="text-3xl md:text-4xl font-bold">Experiência & Educação</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        Onde estive e o que construí pelo caminho
      </p>

      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-[var(--border)]"></div>

        <div class="space-y-2">
          <div
            v-for="(item, index) in timeline"
            :key="index"
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
              <ul v-if="item.achievements" class="mt-3 space-y-1">
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
              <div v-if="item.tags" class="flex flex-wrap gap-2 mt-3">
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
const timeline = [
  {
    period: '2020 – Atual',
    title: 'Consultor & Freelancer',
    current: true,
    description: 'Consultoria em desenvolvimento de software e automações, focando em infraestrutura e soluções criativas.',
    achievements: [
      'Setup de Home Lab completo (K3s + Traefik + Vault + External Secrets)',
      'Automação residencial com Home Assistant via MQTT',
      'Desenvolvimento de bots e moderação para Discord',
    ],
    tags: ['K3s', 'Vault', 'Home Assistant', 'MQTT'],
  },
  {
    period: '2019 – Atual',
    title: 'Engenheiro de Software — Vista / Loft',
    current: true,
    description: 'Engenheiro de Software na Loft, inicialmente no app mobile da Vista. Migrei o aplicativo de Ionic para Flutter e participei de diversos projetos internos.',
    achievements: [
      'Migração completa de app Ionic → Flutter',
      'Integração de APIs RESTful e GraphQL',
      'Mentoria de desenvolvedores juniores',
      'Arquitetura e design de sistemas',
    ],
    tags: ['Flutter', 'GraphQL', 'Scrum', 'DevOps'],
  },
  {
    period: '2017 – 2019',
    title: 'Desenvolvedor Full Stack — Innovate',
    description: 'Sistemas hospitalares com Java e gerenciamento de iluminação pública com Node.js/Angular/Flutter.',
    achievements: [
      'Renderização de 1M+ postes em mapa interativo com clustering',
      'Migração de Ionic para Flutter no app mobile',
      'Backend com Node.js, Express e MongoDB',
    ],
    tags: ['Node.js', 'Angular', 'Flutter', 'MongoDB'],
  },
  {
    period: '2017 – 2018',
    title: 'Desenvolvedor Full Stack — NoBully',
    description: 'Sistema de prevenção ao bullying escolar com autenticação JWT, painel administrativo e notificações em tempo real.',
    tags: ['JWT', 'WebSockets', 'OneSignal'],
  },
  {
    period: '2016 – 2018',
    title: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    description: 'Uninassau — TCC: "Game Endless Runner Multiplataforma".',
    tags: ['ADS', 'TCC'],
  },
]
</script>
