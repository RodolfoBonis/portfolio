<template>
  <section id="works" class="py-20 px-4 bg-[var(--bg-color)]">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-4xl font-semibold text-[var(--heading-color)] text-center mb-12"
      >
        Projetos em Destaque
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :delay="index * 200"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const projects = [
  {
    id: 'hermes',
    title: 'Hermes',
    description:
      'Sistema de notificações : Push, WhatsApp, Telegram e Slack com segmentação por tags',
    image: '/api/cdn/portfolio/hermes.png',
    tags: ['Go', 'Flutter', 'Kafka', 'RabbitMQ'],
    githubUrl: 'https://github.com/RodolfoBonis/hermes',
    details: {
      description:
        'Hermes é um sistema de notificações que unifica múltiplos canais de comunicação (Push, WhatsApp, Telegram, Slack). Está sendo desenvolvido em Go (backend), Flutter (frontend) e utiliza Kafka + RabbitMQ no core para filas de mensagens e retry automático. A infraestrutura roda em K3s, monitorada por Prometheus + Grafana, com gerenciamento de segredos via Vault, e deploy automatizado pelo ArgoCD.',
      challenges: [
        'Implementar multi-tenant sem vazamento de dados entre clientes.',
        'Manter latência abaixo de 200ms para notificações push críticas.',
        'Integração de gateways externos (SendGrid, Twilio, FCM, etc.).',
        'Rotina de cobrança e reutilização de métricas do SonarQube para qualidade contínua.',
      ],
      technologies: [
        'Go',
        'Flutter',
        'Kafka',
        'RabbitMQ',
        'K3s',
        'Vault',
        'Grafana',
      ],
    },
  },
  {
    id: 'microdetect',
    title: 'MicroDetect',
    description:
      'Projeto de TCC: detecção e contagem de leveduras via YOLOv8 e FastAPI, com interface Flutter para visualização dos resultados.',
    image: '/api/cdn/portfolio/microdetect.png',
    tags: ['Python', 'YOLOv8', 'FastAPI', 'Flutter'],
    githubUrl: 'https://github.com/RodolfoBonis/microdetect',
    details: {
      description:
        'MicroDetect é um projeto de TCC que consiste em um sistema de visão computacional para classificação e contagem de leveduras. Utilizamos YOLOv8 para detecção, FastAPI como backend e Flutter para a interface Desktop. A pipeline envolve: anotação de imagens, treinamento customizado com data augmentation e endpoints REST para consulta em tempo real.',
      highlights: [
        'Dataset de microscopia anotado manualmente (> 1.200 imagens).',
        'Interface Flutter com gráficos de contagem em tempo real.',
      ],
      technologies: ['Python', 'YOLOv8', 'FastAPI', 'Flutter'],
    },
  },
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    description:
      'Portfólio pessoal desenvolvido com Nuxt 3, Tailwind CSS e ScrollReveal para animações.',
    image: '/api/cdn/portfolio/portfolio-pessoal.png',
    tags: ['Nuxt 3', 'Tailwind CSS', 'ScrollReveal'],
    githubUrl: 'https://github.com/RodolfoBonis/portfolio',
    details: {
      description:
        'Este portfólio foi desenvolvido para apresentar meus projetos e habilidades. Utiliza Nuxt 3 para renderização do lado do servidor, Tailwind CSS para estilização e ScrollReveal para animações de entrada. O design é responsivo e otimizado para SEO.',
      highlights: [
        'Renderização do lado do servidor com Nuxt 3.',
        'Estilização moderna e responsiva com Tailwind CSS.',
        'Animações suaves de entrada com ScrollReveal.',
        'Otimização para SEO e performance.',
        'Implementação de dark mode com preferências salvas no localStorage.',
        'Deploy automatizado via GitHub Actions e ArgoCD.',
        'Integração com Formspree para formulários de contato.',
        'Implementar API para gerenciamento das seções do portfólio.',
      ],
      technologies: [
        'Nuxt 3',
        'Tailwind CSS',
        'ScrollReveal',
        'GitHub Actions',
        'ArgoCD',
      ],
    },
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
