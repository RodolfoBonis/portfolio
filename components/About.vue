<template>
  <section id="about" class="py-24 relative">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">01.</span>
        <h2 class="text-3xl md:text-4xl font-bold">Sobre Mim</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        Conheça a pessoa por trás do código
      </p>

      <div class="grid lg:grid-cols-5 gap-12">
        <!-- Photo + Bio -->
        <div class="lg:col-span-2 space-y-6">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-emerald-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
            <img
              :src="logoUrl"
              alt="Rodolfo De Bonis"
              class="relative w-full aspect-square object-cover rounded-2xl border border-[var(--border)]"
            />
          </div>
          <div class="flex justify-center gap-4">
            <a
              v-for="social in socials"
              :key="social.url"
              :href="social.url"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all"
              :title="social.name"
            >
              <span class="material-icons text-lg">{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3 space-y-8">
          <div class="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              Sou Rodolfo, moro em <span class="text-[var(--text-primary)]">Maceió - AL</span>
              e tenho {{ age }} anos. Com {{ yearsExp }}+ anos de carreira em
              desenvolvimento de software, já mergulhei fundo em tudo — de
              Flutter e mobile até Kubernetes e infraestrutura como código.
            </p>
            <p>
              Minha missão é simples: <span class="text-[var(--accent)]">minimizar ao máximo qualquer tarefa manual</span>
              para focar no que realmente importa. Um pipeline CI/CD bem afinado
              é tão satisfatório quanto um crítico de 20 em D&D.
            </p>
            <p>
              Quando não estou orquestrando clusters no
              <span class="mono text-[var(--text-primary)]">Rb Lab</span>,
              você me encontra liderando sessões épicas de D&D 5e ou
              clutchando rounds no R6 Siege.
            </p>
          </div>

          <!-- Quick facts -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="fact in facts"
              :key="fact.label"
              class="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover-lift"
            >
              <span class="material-icons text-[var(--accent)]">{{ fact.icon }}</span>
              <div>
                <div class="text-xs text-[var(--text-muted)] mono">{{ fact.label }}</div>
                <div class="text-sm text-[var(--text-primary)]">{{ fact.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const logoUrl = '/api/cdn/portfolio/me.jpeg'
const age = new Date().getFullYear() - 1996
const yearsExp = new Date().getFullYear() - 2017

const facts = [
  { icon: 'location_on', label: 'Localização', value: 'Maceió, Brasil' },
  { icon: 'timer', label: 'Experiência', value: `${yearsExp}+ anos` },
  { icon: 'code', label: 'Linguagens', value: 'Go • Python • Dart • TS' },
  { icon: 'sports_esports', label: 'Hobbies', value: 'D&D 5e • R6 Siege' },
]

const socials = [
  { name: 'GitHub', icon: 'code', url: 'https://github.com/RodolfoBonis' },
  { name: 'LinkedIn', icon: 'work', url: 'https://www.linkedin.com/in/rodolfo-de-bonis/' },
  { name: 'X', icon: 'rocket_launch', url: 'https://x.com/RodolfoBonis' },
  { name: 'Email', icon: 'email', url: 'mailto:dev@rodolfodebonis.com.br' },
]
</script>
