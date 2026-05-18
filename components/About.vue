<template>
  <section id="about" class="py-24 relative">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="flex items-center gap-3 mb-4">
        <span class="mono text-[var(--accent)] text-sm">01.</span>
        <h2 class="text-3xl md:text-4xl font-bold">{{ t('about.section') }}</h2>
      </div>
      <p class="text-[var(--text-muted)] mb-16 max-w-2xl">
        {{ t('about.intro') }}
      </p>

      <div class="grid lg:grid-cols-5 gap-12">
        <!-- Photo + Bio -->
        <div class="lg:col-span-2 space-y-6">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-emerald-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
            <NuxtImg
              :src="logoUrl"
              alt="Rodolfo De Bonis"
              width="640"
              height="640"
              sizes="(max-width: 768px) 100vw, 40vw"
              loading="eager"
              fetchpriority="high"
              format="avif,webp"
              quality="80"
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
              {{ t('about.bio.p1Prefix') }}
              <span class="text-[var(--text-primary)]">{{ t('about.bio.p1Location') }}</span>
              {{ t('about.bio.p1Middle', { age, years: yearsExp }) }}
            </p>
            <p>
              {{ t('about.bio.p2Prefix') }}
              <span class="text-[var(--accent)]">{{ t('about.bio.p2Highlight') }}</span>
              {{ t('about.bio.p2Suffix') }}
            </p>
            <p>
              {{ t('about.bio.p3Prefix') }}
              <span class="mono text-[var(--text-primary)]">{{ t('about.bio.p3Lab') }}</span>{{ t('about.bio.p3Suffix') }}
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
const { t } = useI18n()
const logoUrl = '/api/cdn/portfolio/me.jpeg'
const age = new Date().getFullYear() - 1996
const yearsExp = new Date().getFullYear() - 2017

// Facts pull label + value from the active locale; icon is neutral.
// Computed so the dependency on the i18n message bundle re-runs
// when the user clicks the language switcher.
const facts = computed(() => [
  { icon: 'location_on', label: t('about.facts.location.label'), value: t('about.facts.location.value') },
  { icon: 'timer', label: t('about.facts.experience.label'), value: t('about.facts.experience.value', { years: yearsExp }) },
  { icon: 'code', label: t('about.facts.languages.label'), value: t('about.facts.languages.value') },
  { icon: 'sports_esports', label: t('about.facts.hobbies.label'), value: t('about.facts.hobbies.value') },
])

const socials = [
  { name: 'GitHub', icon: 'code', url: 'https://github.com/RodolfoBonis' },
  { name: 'LinkedIn', icon: 'work', url: 'https://www.linkedin.com/in/rodolfo-de-bonis/' },
  { name: 'X', icon: 'rocket_launch', url: 'https://x.com/RodolfoBonis' },
  { name: 'Email', icon: 'email', url: 'mailto:dev@rodolfodebonis.com.br' },
]
</script>
