<template>
  <section
    id="hero"
    class="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24"
  >
    <!-- Foto Circular com Borda Animada -->
    <div class="mb-8">
      <img
        :src="logoUrl"
        alt="Foto de Rodolfo De Bonis"
        class="w-40 h-40 rounded-full border-4 border-[var(--accent-color)] animate-fade-in"
      />
    </div>

    <!-- Nome e Subtítulo Dinâmico -->
    <h1
      class="text-5xl md:text-6xl font-poppins font-semibold mb-4 text-[var(--heading-color)] animate-fade-in"
    >
      Rodolfo De Bonis
    </h1>
    <div
      class="text-xl text-[var(--text-color)] mb-6 flex items-center justify-center animate-fade-in"
    >
      <span ref="headline" class="inline-block"></span>
      <span
        class="bg-[var(--accent-color)] w-1 h-6 align-middle inline-block ml-1 animate-pulse"
      ></span>
    </div>

    <!-- CTA -->
    <NuxtLink
      to="#contact"
      class="inline-block bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--accent-light)] transition animate-fade-in"
    >
      Vamos conversar?
    </NuxtLink>
  </section>
</template>

<script setup>
const logoUrl = '/api/cdn/portfolio/me.jpeg'

const headlines = [
  'Engenheiro de Software',
  'DevOps Entusiasta',
  'Criador de Soluções Inusitadas',
  'Mestre de D&D nas horas vagas',
]

let idx = 0
let charIdx = 0
const headline = ref(null)
const typeSpeed = 100
const eraseSpeed = 50
const delayBetween = 2000

function typeEffect() {
  if (charIdx < headlines[idx].length) {
    headline.value.textContent += headlines[idx].charAt(charIdx)
    charIdx++
    setTimeout(typeEffect, typeSpeed)
  } else {
    setTimeout(eraseEffect, delayBetween)
  }
}

function eraseEffect() {
  if (charIdx > 0) {
    headline.value.textContent = headlines[idx].substring(0, charIdx - 1)
    charIdx--
    setTimeout(eraseEffect, eraseSpeed)
  } else {
    idx = (idx + 1) % headlines.length
    setTimeout(typeEffect, typeSpeed)
  }
}

onMounted(() => {
  setTimeout(typeEffect, delayBetween)
})
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 1.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
