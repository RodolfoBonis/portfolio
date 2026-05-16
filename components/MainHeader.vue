<template>
  <header class="fixed w-full top-0 left-0 z-50 glass">
    <nav class="section-container py-4 flex items-center justify-between">
      <!-- Logo -->
      <a :href="hrefHome" class="mono text-[var(--accent)] font-bold text-lg tracking-tight hover:opacity-80 transition">
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
            type="button"
            @click="onLanguageSwitch"
            class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono text-sm"
            :title="t('header.language.switchTo')"
            :aria-label="t('header.language.switchTo')"
          >
            {{ t('header.language.label') }}
          </button>
        </li>
        <li>
          <button
            @click="toggleTheme"
            class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            :title="isDark ? t('header.theme.toLight') : t('header.theme.toDark')"
          >
            <span class="material-icons text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </li>
      </ul>

      <!-- Mobile Menu Button -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        :aria-label="menuOpen ? t('header.menu.close') : t('header.menu.open')"
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
            type="button"
            @click="onLanguageSwitch"
            class="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mono"
          >
            <span class="material-icons text-lg">language</span>
            <span>{{ t('header.language.switchTo') }}</span>
          </button>
        </li>
        <li>
          <button
            @click="toggleTheme"
            class="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <span class="material-icons text-lg">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            <span>{{ isDark ? t('header.theme.labelLight') : t('header.theme.labelDark') }}</span>
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
const colorMode = useColorMode()
const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const isDark = computed(() => colorMode.value === 'dark')

// useI18n drives both the translated link labels and the language
// switcher. setLocale() persists the choice in the i18n_redirected
// cookie + navigates to the equivalent URL in the new locale (handled
// by @nuxtjs/i18n).
const { t, locale, setLocale } = useI18n()

// Anchor links: when on the localised home (/ or /en) we want bare
// `#anchor`; from any other page we have to send the user back to the
// localised root first so the section exists in the DOM. The leading
// slash flips dynamically based on whether the current path is the
// home or a deep page.
const isHome = computed(() => route.path === '/' || route.path === '/en')
const hrefPrefix = computed(() => (isHome.value ? '' : localeRoot.value))
const localeRoot = computed(() => (locale.value === 'en' ? '/en' : '/'))
const hrefHome = computed(() => (isHome.value ? '#hero' : localeRoot.value))

const links = computed(() => [
  { label: t('header.links.about'), href: `${hrefPrefix.value}#about` },
  { label: t('header.links.stacks'), href: `${hrefPrefix.value}#stacks` },
  { label: t('header.links.projects'), href: `${hrefPrefix.value}#projects` },
  { label: t('header.links.blog'), href: `${hrefPrefix.value}#blog` },
  { label: t('header.links.xp'), href: `${hrefPrefix.value}#experience` },
  { label: t('header.links.contact'), href: `${hrefPrefix.value}#contact` },
])

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

async function onLanguageSwitch() {
  const next = locale.value === 'en' ? 'pt-BR' : 'en'
  // GTM hook so we can attribute future engagement deltas to language
  // preference. Wrap in client-only check so SSR doesn't blow up on
  // the missing `dataLayer`.
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'language_change', language: next })
  }

  const path = route.path
  const isBlogPath = path === '/blog' || path.startsWith('/blog/') || path === '/en/blog' || path.startsWith('/en/blog/')

  if (isBlogPath) {
    const targetPath = next === 'en'
      ? (path.startsWith('/en') ? path : `/en${path}`)
      : path.replace(/^\/en/, '') || '/'

    await setLocale(next)
    await router.push(targetPath)
    menuOpen.value = false
    return
  }

  await setLocale(next)
  menuOpen.value = false
}
</script>
