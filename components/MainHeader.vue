<template>
  <header class="fixed w-full top-0 left-0 z-50 glass">
    <nav class="section-container py-4 flex items-center justify-between">
      <!-- Logo -->
      <a href="#hero" class="mono text-[var(--accent)] font-bold text-lg tracking-tight hover:opacity-80 transition">
        ~/rodolfo<span class="terminal-cursor"></span>
      </a>

      <!-- Desktop Nav -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
          >
            {{ link.label }}
          </a>
        </li>
        <li>
          <button
            @click="toggleTheme"
            class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            :title="isDark ? 'Modo claro' : 'Modo escuro'"
          >
            <span class="material-icons text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </li>
      </ul>

      <!-- Mobile Menu Button -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <span class="material-icons text-2xl">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-show="menuOpen"
      class="md:hidden bg-[var(--bg-secondary)] border-t border-[var(--border)]"
    >
      <ul class="flex flex-col px-6 py-4 gap-4">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            @click="menuOpen = false"
            class="block text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
          >
            {{ link.label }}
          </a>
        </li>
        <li>
          <button
            @click="toggleTheme"
            class="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <span class="material-icons text-lg">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            <span>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
const colorMode = useColorMode()
const menuOpen = ref(false)
const isDark = computed(() => colorMode.value === 'dark')

const links = [
  { label: '.sobre()', href: '#about' },
  { label: '.stacks()', href: '#stacks' },
  { label: '.projetos()', href: '#projects' },
  { label: '.blog()', href: '#blog' },
  { label: '.xp()', href: '#experience' },
  { label: '.contato()', href: '#contact' },
]

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
