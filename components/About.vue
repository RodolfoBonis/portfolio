<template>
  <section id="about" class="py-20 px-4 bg-[var(--bg-color)]">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-semibold text-[var(--heading-color)] mb-8">
        Sobre Mim
      </h2>
      <div class="grid md:grid-cols-3 gap-12">
        <div class="space-y-4 sr-reveal">
          <h3 class="text-2xl font-medium text-[var(--accent-color)]">
            Quem Sou
          </h3>
          <p class="text-sm">
            Sou Rodolfo, moro em Maceió - AL e tenho {{ age }} anos de vida – e
            8 de carreira em desenvolvimento de software. Formado em Análise e
            Desenvolvimento de Sistemas, já mergulhei fundo em Flutter, docker,
            Kubernetes e outras diversas tecnologias. Quando não estou tubulando
            clusters no Rb Lab, você me encontra liderando sessões épicas de
            D&D, tentando convencer o grupo que "Mestre sempre dá XP".
          </p>
        </div>
        <div class="space-y-4 sr-reveal delay-200">
          <h3 class="text-2xl font-medium text-[var(--accent-color)]">
            Missão &amp; Visão
          </h3>
          <p class="text-sm">
            Minha missão é simples: Minimizar ao máximo qualquer tarefa manual
            para que eu possa focar no que realmente importa. Um pipeline CI/CD
            bem afinado é tão satisfatório quanto um crítico de 20 em D&D:
            acontece pouco, mas quando acontece, faz toda a diferença. Sonho com
            o dia em que, relaxado no sofá, vou monitorar meus clusters
            Kubernetes enquanto um robozinho me entrega um café quentinho —
            porque produtividade de verdade é ter sistemas tão eficientes que eu
            mal precise pensar neles e, de quebra, ganhar tempo para criar o
            próximo desafio épico.
          </p>
        </div>
        <div class="space-y-4 sr-reveal delay-400">
          <h3 class="text-2xl font-medium text-[var(--accent-color)]">
            Dados Rápidos
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <div
              class="flex items-center bg-[var(--card-color)] p-4 rounded-lg border border-[var(--border-color)]"
            >
              <span class="material-icons text-[var(--accent-color)] mr-3"
                >location_on</span
              >
              <span>Maceió, Brasil</span>
            </div>
            <div
              class="flex items-center bg-[var(--card-color)] p-4 rounded-lg border border-[var(--border-color)]"
            >
              <span class="material-icons text-[var(--accent-color)] mr-3"
                >timer</span
              >
              <span>8+ anos de experiência</span>
            </div>
            <div
              class="flex items-center bg-[var(--card-color)] p-4 rounded-lg border border-[var(--border-color)]"
            >
              <span class="material-icons text-[var(--accent-color)] mr-3"
                >code</span
              >
              <span>Linguagens: Go • Python • Dart • JavaScript</span>
            </div>
            <div
              class="flex items-center bg-[var(--card-color)] p-4 rounded-lg border border-[var(--border-color)]"
            >
              <span class="material-icons text-[var(--accent-color)] mr-3"
                >build</span
              >
              <span
                >Ferramentas: Kubernetes • Terraform • Vault • n8n •
                SonarQube</span
              >
            </div>
            <div
              class="flex items-center bg-[var(--card-color)] p-4 rounded-lg border border-[var(--border-color)]"
            >
              <span class="material-icons text-[var(--accent-color)] mr-3"
                >sports_esports</span
              >
              <span>Hobbies: R6 Siege, D&D 5e, Maratona de séries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const age = new Date().getFullYear() - 1996
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
