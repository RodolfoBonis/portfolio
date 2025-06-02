<template>
  <div
    class="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center p-4"
  >
    <div class="max-w-2xl text-center">
      <img
        :src="logoUrl"
        alt="Personagem D&D soterrado em pixels"
        class="w-full max-w-md mx-auto mb-8"
      />
      <h1 class="text-4xl font-bold text-[var(--heading-color)] mb-4">404</h1>
      <p class="text-xl text-[var(--text-color)] mb-8">
        Ops! Parece que essa rota caiu em um buraco sem fim... Volte para o
        início e tente novamente.
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-[var(--accent-color)] hover:bg-[var(--accent-light)] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Voltar ao Início
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const logoUrl = '/api/cdn/portfolio/not-found.png'
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
