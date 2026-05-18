<template>
  <section
    id="hero"
    class="min-h-screen flex items-center justify-center relative overflow-hidden"
  >
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 via-transparent to-transparent"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[128px] pointer-events-none"></div>

    <div class="section-container w-full py-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Content -->
        <div class="space-y-8">
          <div class="animate-fade-up">
            <span class="badge">{{ t('hero.available') }}</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up delay-100">
            {{ firstName }}
            <br />
            <span class="text-[var(--accent)]">{{ lastName }}</span>
          </h1>

          <p class="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg animate-fade-up delay-200">
            {{ t('hero.subtitle', { years: yearsExp }) }}
            <span class="text-[var(--text-primary)]">{{ t('hero.subtitleHighlight') }}</span>.
          </p>

          <div class="flex flex-wrap gap-4 animate-fade-up delay-300">
            <a
              :href="`${homePrefix}#contact`"
              class="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              <span class="material-icons text-lg">rocket_launch</span>
              {{ t('hero.ctaTalk') }}
            </a>
            <a
              :href="`${homePrefix}#projects`"
              class="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {{ t('hero.ctaProjects') }}
              <span class="material-icons text-lg">arrow_forward</span>
            </a>
          </div>

          <!-- Quick stats -->
          <div class="flex gap-8 pt-4 animate-fade-up delay-400">
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">{{ yearsExp }}+</div>
              <div class="text-xs text-[var(--text-muted)] mono">{{ t('hero.stats.years') }}</div>
            </div>
            <div class="w-px bg-[var(--border)]"></div>
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">24+</div>
              <div class="text-xs text-[var(--text-muted)] mono">{{ t('hero.stats.tech') }}</div>
            </div>
            <div class="w-px bg-[var(--border)]"></div>
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">∞</div>
              <div class="text-xs text-[var(--text-muted)] mono">{{ t('hero.stats.coffee') }}</div>
            </div>
          </div>
        </div>

        <!-- Right: Terminal -->
        <div class="animate-fade-up delay-200">
          <div class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
            <!-- Terminal header -->
            <div class="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
              <div class="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div class="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div class="w-3 h-3 rounded-full bg-[#28c840]"></div>
              <span class="ml-2 text-xs text-[var(--text-muted)] mono">rodolfo@rb-lab:~</span>
            </div>
            <!-- Terminal content -->
            <div class="p-6 mono text-sm leading-relaxed space-y-2">
              <div>
                <span class="text-[var(--accent)]">❯</span>
                <span class="text-[var(--text-muted)]"> cat</span>
                <span class="text-[var(--text-primary)]"> sobre.json</span>
              </div>
              <div class="text-[var(--text-muted)] pl-2">
                <div>{</div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"nome"</span>: <span class="text-amber-400">"{{ profile?.name ?? 'Rodolfo De Bonis' }}"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"role"</span>: <span class="text-amber-400">"{{ profile?.headline ?? 'Software Engineer' }}"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"location"</span>: <span class="text-amber-400">"{{ locationLine }}"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"stack"</span>: [<template v-for="(s, i) in stackPreview" :key="s"><span class="text-amber-400">"{{ s }}"</span><span v-if="i < stackPreview.length - 1">, </span></template>],
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"hobby"</span>: <span class="text-amber-400">"{{ profile?.hobbies?.[0] ?? 'D&D 5e Master 🎲' }}"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"available"</span>: <span class="text-emerald-400">true</span>
                </div>
                <div>}</div>
              </div>
              <div class="pt-2">
                <span class="text-[var(--accent)]">❯</span>
                <span ref="terminalLine" class="text-[var(--text-primary)]"></span>
                <span class="terminal-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { usePortfolio } from '~/composables/usePortfolio'

const props = defineProps({
  // Pre-fetched profile coming from pages/index.vue's root useAsyncData.
  // Falls back to a fresh fetch when this component is dropped into a
  // page that doesn't provide it (smoke / experiments).
  profile: { type: Object, default: null },
})

const { t, locale } = useI18n()
const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '/en')
const homePrefix = computed(() => {
  if (isHome.value) return ''
  return locale.value === 'en' ? '/en' : '/'
})

const { data: fallbackProfile } = await useAsyncData(
  'hero-profile-fallback',
  () =>
    props.profile
      ? Promise.resolve(props.profile)
      : usePortfolio().getProfile(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const profile = computed(() => props.profile ?? fallbackProfile.value ?? null)

// Years of experience comes from the CMS now; legacy fallback keeps
// the page intact if the API is unreachable on a cold render.
const yearsExp = computed(
  () => profile.value?.years_experience ?? new Date().getFullYear() - 2017,
)

// Split the name on the first space so the design's two-line title
// keeps working with any name in the CMS. Single-word names render
// the whole name on line one and leave the accent line empty.
const firstName = computed(() => {
  const name = profile.value?.name ?? 'Rodolfo'
  const idx = name.indexOf(' ')
  return idx === -1 ? name : name.slice(0, idx)
})
const lastName = computed(() => {
  const name = profile.value?.name ?? 'De Bonis'
  const idx = name.indexOf(' ')
  return idx === -1 ? '' : name.slice(idx + 1)
})

const locationLine = computed(() => {
  const city = profile.value?.location_city ?? 'Maceió'
  const region = profile.value?.location_region ?? 'AL'
  return `${city}, ${region} 🇧🇷`
})

// Terminal stack preview: first 4 languages from the profile so it
// stays in sync with the bio without us hand-rolling an array here.
const stackPreview = computed(() => {
  const langs = profile.value?.languages ?? ['Go', 'Flutter', 'K8s', 'Vue']
  return langs.slice(0, 4)
})

const terminalLine = ref(null)
const commands = [
  'kubectl get pods --all-namespaces',
  'go build -o server ./cmd/api',
  'docker compose up -d',
  'git push origin main',
  'terraform apply -auto-approve',
  'flutter run --release',
]

let cmdIdx = 0
let charIdx = 0
const typeSpeed = 60
const eraseSpeed = 30
const delayBetween = 2500

function typeEffect() {
  if (!terminalLine.value) return
  if (charIdx < commands[cmdIdx].length) {
    terminalLine.value.textContent += commands[cmdIdx].charAt(charIdx)
    charIdx++
    setTimeout(typeEffect, typeSpeed)
  } else {
    setTimeout(eraseEffect, delayBetween)
  }
}

function eraseEffect() {
  if (!terminalLine.value) return
  if (charIdx > 0) {
    terminalLine.value.textContent = commands[cmdIdx].substring(0, charIdx - 1)
    charIdx--
    setTimeout(eraseEffect, eraseSpeed)
  } else {
    cmdIdx = (cmdIdx + 1) % commands.length
    setTimeout(typeEffect, 500)
  }
}

onMounted(() => {
  setTimeout(typeEffect, 1500)
})
</script>
