<template>
  <header
    class="fixed w-full top-0 left-0 z-50 bg-[var(--card-color)]/80 backdrop-blur-md"
  >
    <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        to="#hero"
        class="text-[var(--accent-color)] font-bold text-2xl hover:opacity-80"
      >
        R<span class="text-[var(--heading-color)]">.</span>
      </NuxtLink>

      <!-- Links (Desktop) -->
      <ul class="hidden md:flex space-x-8 text-sm font-medium">
        <li>
          <NuxtLink to="#about" class="hover:text-[var(--accent-light)]"
            >Sobre</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#stacks" class="hover:text-[var(--accent-light)]"
            >Stacks</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#works" class="hover:text-[var(--accent-light)]"
            >Projetos</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#experience" class="hover:text-[var(--accent-light)]"
            >Experiência</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#contact" class="hover:text-[var(--accent-light)]"
            >Contato</NuxtLink
          >
        </li>
      </ul>

      <!-- Botão de Toggle de Tema (Desktop) -->
      <button
        class="hidden md:block text-xl text-[var(--text-color)] hover:text-[var(--accent-light)]"
        @click="toggleTheme"
      >
        <span class="material-icons">{{
          isDarkMode ? 'light_mode' : 'dark_mode'
        }}</span>
      </button>

      <!-- Botão Hamburger (Mobile) -->
      <button
        class="md:hidden text-2xl text-[var(--text-color)] hover:text-[var(--accent-light)]"
        @click="toggleMobileMenu"
      >
        <span class="material-icons">menu</span>
      </button>
    </nav>

    <!-- Menu (Mobile) -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-[var(--card-color)]">
      <ul class="flex flex-col px-6 py-4 space-y-4">
        <li>
          <NuxtLink to="#about" class="block hover:text-[var(--accent-light)]"
            >Sobre</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#stacks" class="block hover:text-[var(--accent-light)]"
            >Stacks</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#works" class="block hover:text-[var(--accent-light)]"
            >Projetos</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="#experience"
            class="block hover:text-[var(--accent-light)]"
            >Experiência</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="#contact" class="block hover:text-[var(--accent-light)]"
            >Contato</NuxtLink
          >
        </li>
        <li>
          <button
            class="flex items-center space-x-2 text-[var(--text-color)] hover:text-[var(--accent-light)]"
            @click="toggleTheme"
          >
            <span class="material-icons">{{
              isDarkMode ? 'light_mode' : 'dark_mode'
            }}</span>
            <span class="text-sm">{{
              isDarkMode ? 'Modo Claro' : 'Modo Escuro'
            }}</span>
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)
const isMobileMenuOpen = ref(false)

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('light-mode')
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  // Carrega preferência salva no localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.remove('light-mode')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.add('light-mode')
  }
})
</script>
