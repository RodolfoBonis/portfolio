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
            <img
              :src="avatarUrl"
              :alt="profile?.name ?? 'Rodolfo De Bonis'"
              width="640"
              height="640"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="relative w-full aspect-square object-cover rounded-2xl border border-[var(--border)]"
            />
          </div>
          <div class="flex justify-center gap-4">
            <a
              v-for="social in socials"
              :key="social.url"
              :href="social.url"
              :target="social.external ? '_blank' : null"
              :rel="social.external ? 'noopener noreferrer' : null"
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all"
              :title="social.name"
            >
              <span class="material-icons text-lg">{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Bio: rendered HTML straight from the CMS. The backend
               sanitises through goldmark (no scripts / no inline
               styles) so v-html is safe here. -->
          <div
            v-if="profile?.bio_html"
            class="space-y-4 text-[var(--text-secondary)] leading-relaxed prose-bio"
            v-html="profile.bio_html"
          ></div>

          <!-- Quick facts: pulled from profile (location/years/
               languages/hobbies). Falls back to the i18n message
               bundle if the API is unreachable on a cold render. -->
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
import { usePortfolio } from '~/composables/usePortfolio'

const props = defineProps({
  profile: { type: Object, default: null },
})

const { t, locale } = useI18n()

const { data: fallbackProfile } = await useAsyncData(
  'about-profile-fallback',
  () =>
    props.profile
      ? Promise.resolve(props.profile)
      : usePortfolio().getProfile(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const profile = computed(() => props.profile ?? fallbackProfile.value ?? null)

const avatarUrl = computed(
  () => profile.value?.avatar_url ?? '/api/cdn/portfolio/me.jpeg',
)
const yearsExp = computed(
  () => profile.value?.years_experience ?? new Date().getFullYear() - 2017,
)

const locationValue = computed(() => {
  const city = profile.value?.location_city
  const country = profile.value?.location_country
  if (city && country) return `${city}, ${country}`
  return t('about.facts.location.value')
})

const languagesValue = computed(() => {
  const langs = profile.value?.languages
  if (langs && langs.length > 0) return langs.join(' • ')
  return t('about.facts.languages.value')
})

const hobbiesValue = computed(() => {
  const list = profile.value?.hobbies
  if (list && list.length > 0) return list.join(' • ')
  return t('about.facts.hobbies.value')
})

const facts = computed(() => [
  {
    icon: 'location_on',
    label: t('about.facts.location.label'),
    value: locationValue.value,
  },
  {
    icon: 'timer',
    label: t('about.facts.experience.label'),
    value: t('about.facts.experience.value', { years: yearsExp.value }),
  },
  {
    icon: 'code',
    label: t('about.facts.languages.label'),
    value: languagesValue.value,
  },
  {
    icon: 'sports_esports',
    label: t('about.facts.hobbies.label'),
    value: hobbiesValue.value,
  },
])

// Social links from the profile; fall back to the static defaults
// when a field is empty so a partially-filled CMS doesn't blank the
// rail.
const socials = computed(() => {
  const out = []
  const g = profile.value?.github_url
  if (g) out.push({ name: 'GitHub', icon: 'code', url: g, external: true })
  const l = profile.value?.linkedin_url
  if (l) out.push({ name: 'LinkedIn', icon: 'work', url: l, external: true })
  const x = profile.value?.twitter_url
  if (x) out.push({ name: 'X', icon: 'rocket_launch', url: x, external: true })
  const e = profile.value?.email
  if (e) out.push({ name: 'Email', icon: 'email', url: `mailto:${e}`, external: false })
  if (out.length === 0) {
    // Cold-fallback set so the page never renders zero social pills.
    return [
      { name: 'GitHub', icon: 'code', url: 'https://github.com/RodolfoBonis', external: true },
      { name: 'LinkedIn', icon: 'work', url: 'https://www.linkedin.com/in/rodolfo-de-bonis/', external: true },
      { name: 'Email', icon: 'email', url: 'mailto:dev@rodolfodebonis.com.br', external: false },
    ]
  }
  return out
})
</script>

<style scoped>
/* Mirrors the rhythm of the legacy three-paragraph i18n bio so the
 * rendered Markdown <p> tags pick up the same spacing/colour the
 * design relied on. */
.prose-bio :deep(p) {
  margin: 0 0 1rem;
}
.prose-bio :deep(p:last-child) {
  margin-bottom: 0;
}
.prose-bio :deep(strong) {
  color: var(--accent);
  font-weight: 600;
}
.prose-bio :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}
</style>
