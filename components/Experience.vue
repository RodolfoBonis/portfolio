<template>
  <section id="experience" class="py-20 px-4 bg-[var(--card-color)]">
    <div class="max-w-4xl mx-auto">
      <h2
        class="text-4xl font-semibold text-[var(--heading-color)] text-center mb-12"
      >
        Experiência &amp; Educação
      </h2>
      <div class="relative border-l-2 border-[var(--border-color)] ml-4">
        <TimelineItem
          v-for="(item, index) in timeline"
          :key="index"
          :item="item"
          :delay="index * 200"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const timeline = [
  {
    period: '2020 – atual',
    title: 'Consultor & Freelancer',
    description:
      'Atuando como consultor em Desenvolvimento de Software e Automações desenvolvendo:',
    list: [
      'Setup completo de Home Lab (K3s + Traefik + Vault + External Secrets)',
      'Automação Home Assistant para residências inteligentes via MQTT',
      'Moderação e desenvolvimento de bots para Discord',
    ],
  },
  {
    period: '2019 – Atual',
    title: 'Engenheiro de Software na Empresa Vista / Loft',
    description:
      'Atuo na Loft como Engenheiro de Software, onde inicialmente fui trabalhei no aplicativo mobile da Vista, onde inicialmente era feito em Ionic, e realizei a migração para Flutter, implementei e participei de diversos projetos. Por questões de confidencialidade, não posso compartilhar detalhes específicos, mas posso dizer que minha experiência inclui:',
    list: [
      'Desenvolvimento de aplicativos móveis com Flutter',
      'Integração de APIs RESTful e GraphQL',
      'Implementação de testes automatizados',
      'Colaboração em equipe ágil usando Scrum',
      'Participação em revisões de código e práticas de DevOps',
      'Otimização de desempenho e usabilidade do aplicativo',
      'Contribuição para a arquitetura e design do sistema',
      'Mentoria de desenvolvedores juniores e estagiários',
      'Participação em reuniões de planejamento e retrospectivas',
      'Migração de sistemas legados para novas tecnologias',
      'Dentre outras atividades relacionadas ao desenvolvimento de software.',
    ],
  },
  {
    period: '2017 – 2018',
    title: 'Desenvolvedor Full Stack na Empresa NoBully',
    description:
      'Atuei na NoBully desenvolvendo um sistema de prevenção ao bullying escolar, onde desenvolvi um sistema de autenticação e autorização robusto usando JWT. Também participei da criação de um painel administrativo para gestão de usuários e relatórios, além de implementar notificações em tempo real usando WebSockets e OneSignal.',
  },
  {
    period: '2017 – 2019',
    title: 'Desenvolvedor Full Stack na Empresa Innovate',
    description:
      'Atuei na Innovate trabalhando em sistemas hospitalares com Java e Flash, onde implementei a chamada de paciente por voz, otimizei a interface da sala de espera para exibir nomes de forma mais clara e desenvolvi módulos de relatórios, além de integrar um leitor de código de barras ao controle de estoque para reduzir erros manuais. Em seguida, participei de um projeto para gerenciamento de iluminação pública, atuando no backend com Node.js, Express e MongoDB, no frontend web em Angular 2+ e no aplicativo móvel inicialmente em Ionic, posteriormente migrado para Flutter. Um dos maiores desafios foi renderizar mais de 1 milhão de postes num mapa interativo: a equipe atuou usando a renderização dos pontos em um canvas e técnicas de clustering e carregamento progressivo para manter a fluidez em web e mobile.',
  },
  {
    period: '2017 – 2017',
    title: 'Desenvolvedor Full Stack no Aplicativo "Coleta Seletiva"',
    description:
      'Atuei como desenvolvedor full stack no aplicativo "Coleta Seletiva", onde implementei a funcionalidade de geolocalização para encontrar pontos de coleta próximos, desenvolvi um sistema de autenticação e autorização robusto usando JWT, e criei um painel administrativo para gestão de usuários e relatórios. Também implementei notificações em tempo real usando WebSockets e OneSignal.',
  },
  {
    period: '2016 – 2018',
    title: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    description: 'Uninassau – TCC: "Game Endless Runner Multiplataforma".',
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
