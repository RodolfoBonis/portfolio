<template>
  <PageNotFound v-if="error.statusCode === 404" />
  <div
    v-else
    class="min-h-screen bg-[var(--bg-color)] flex items-center justify-center"
  >
    <div class="text-center">
      <h1 class="text-4xl font-bold text-[var(--heading-color)] mb-4">
        Erro {{ error.statusCode }}
      </h1>
      <p class="text-xl text-[var(--text-color)] mb-8">{{ error.message }}</p>
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
import PageNotFound from '~/components/PageNotFound.vue'

const { initTheme } = useTheme()
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

onMounted(() => {
  initTheme()
})

// Se não for um erro 404, redirecionar para a página inicial após 5 segundos
if (props.error.statusCode !== 404) {
  setTimeout(() => {
    navigateTo('/')
  }, 5000)
}
</script>
