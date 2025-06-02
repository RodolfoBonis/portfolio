<template>
  <section id="stacks" class="py-20 px-4 bg-[var(--card-color)]">
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-4xl font-semibold text-[var(--heading-color)] mb-12">
        Stacks &amp; Ferramentas
      </h2>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
      >
        <StackItem
          v-for="(stack, index) in stacks"
          :key="stack.name"
          :stack="stack"
          :delay="index * 100"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const iconPath = (name) => `/icons/${name}.svg`

const stacks = [
  {
    name: 'Go',
    icon: iconPath('go'),
    tooltip: 'Meu hiper-veloz backend favorito.',
  },
  {
    name: 'Python',
    icon: iconPath('python'),
    tooltip: '"Baterias incluídas" para prototipagem rápida.',
  },
  {
    name: 'FastAPI',
    icon: iconPath('fastapi'),
    tooltip: 'Microserviços leves e ultra-rápidos.',
  },
  {
    name: 'Flutter',
    icon: iconPath('flutter'),
    tooltip: 'Construindo UIs fluidas para Mobile e Web.',
  },
  {
    name: 'Vue.js',
    icon: iconPath('vue'),
    tooltip: 'Reatividade e simplicidade na medida certa.',
  },
  {
    name: 'Nuxt 3',
    icon: iconPath('nuxt'),
    tooltip: 'Server-Side Rendering com Vue. SEO garantido.',
  },
  {
    name: 'K3s',
    icon: iconPath('kubernetes'),
    tooltip: 'Meu cluster leve favorito para testes no Rb Lab.',
  },
  {
    name: 'AWS',
    icon: iconPath('aws'),
    tooltip: 'Nuvem robusta para escalar aplicações.',
  },
  {
    name: 'Vault',
    icon: iconPath('vault'),
    tooltip: 'Segredos bem guardados e em paz.',
  },
  {
    name: 'ArgoCD',
    icon: iconPath('argocd'),
    tooltip: 'GitOps: Deploy automático ou nada feito.',
  },
  {
    name: 'Terraform',
    icon: iconPath('terraform'),
    tooltip: 'Infra Como Código: reproduce clusters no CLI.',
  },
  {
    name: 'Docker',
    icon: iconPath('docker'),
    tooltip: 'Contêinerização: "Isola e executa."',
  },
  {
    name: 'Elastic',
    icon: iconPath('elasticsearch'),
    tooltip: 'Motor de busca para resultados instantâneos.',
  },
  {
    name: 'PostgreSQL',
    icon: iconPath('postgresql'),
    tooltip: 'Banco relacional, robusto e confiável.',
  },
  {
    name: 'MinIO',
    icon: iconPath('minio'),
    tooltip: 'Armazenamento de objetos local e fácil de escalar.',
  },
  {
    name: 'Redis',
    icon: iconPath('redis'),
    tooltip: 'Cache ultra rápido para dar aceleração no app.',
  },
  {
    name: 'GitHub Actions',
    icon: iconPath('github-actions'),
    tooltip: 'CI/CD direto no GitHub, sem sair do repositório.',
  },
  {
    name: 'SonarQube',
    icon: iconPath('sonarqube'),
    tooltip: 'Qualidade de código é prioridade zero.',
  },
  {
    name: 'n8n',
    icon: iconPath('n8n'),
    tooltip: 'Automação de fluxos sem escrever uma linha de código.',
  },
  {
    name: 'Swift',
    icon: iconPath('swift'),
    tooltip: 'Desenvolvimento iOS com performance e segurança.',
  },
  {
    name: 'Android',
    icon: iconPath('android'),
    tooltip: 'Desenvolvimento Android com Kotlin e Java.',
  },
  {
    name: 'Ionic',
    icon: iconPath('ionic'),
    tooltip:
      'Híbrido, ótima curva de aprendizado para apps móveis para quem vem da web com Angular.',
  },
  {
    name: 'Angular 2+',
    icon: iconPath('angular'),
    tooltip: 'Framework robusto para aplicações web dinâmicas.',
  },
  {
    name: 'Arduino',
    icon: iconPath('arduino'),
    tooltip: 'Brincando com hardware e IoT.',
  },
]

onMounted(() => {
  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '40px',
    duration: 800,
    delay: 100,
    reset: false,
  })

  sr.reveal('.sr-reveal', { interval: 200 })
})
</script>
