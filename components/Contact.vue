<template>
  <section id="contact" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="max-w-2xl mx-auto text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="mono text-[var(--accent)] text-sm">05.</span>
          <h2 class="text-3xl md:text-4xl font-bold">{{ t('contact.section') }}</h2>
        </div>
        <p class="text-[var(--text-muted)] mb-12">
          {{ t('contact.intro') }}
          <br />
          <span class="text-[var(--text-secondary)]">{{ t('contact.introCta') }}</span>
        </p>

        <form
          :action="formspreeAction"
          method="POST"
          class="space-y-5 text-left"
        >
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs mono text-[var(--text-muted)] mb-2">{{ t('contact.form.nameLabel') }}</label>
              <input
                type="text"
                name="name"
                required
                class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                :placeholder="t('contact.form.namePlaceholder')"
              />
            </div>
            <div>
              <label class="block text-xs mono text-[var(--text-muted)] mb-2">{{ t('contact.form.emailLabel') }}</label>
              <input
                type="email"
                name="email"
                required
                class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                :placeholder="t('contact.form.emailPlaceholder')"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs mono text-[var(--text-muted)] mb-2">{{ t('contact.form.subjectLabel') }}</label>
            <input
              type="text"
              name="subject"
              required
              class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
              :placeholder="t('contact.form.subjectPlaceholder')"
            />
          </div>
          <div>
            <label class="block text-xs mono text-[var(--text-muted)] mb-2">{{ t('contact.form.messageLabel') }}</label>
            <textarea
              name="message"
              rows="5"
              required
              class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-none"
              :placeholder="t('contact.form.messagePlaceholder')"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--bg-primary)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <span class="material-icons text-lg">send</span>
            {{ t('contact.form.submit') }}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-20 pt-8 border-t border-[var(--border)]">
          <div class="flex justify-center gap-6 mb-6">
            <a
              v-for="social in socials"
              :key="social.url"
              :href="social.url"
              :target="social.external ? '_blank' : null"
              :rel="social.external ? 'noopener noreferrer' : null"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              :title="social.name"
            >
              <span class="material-icons">{{ social.icon }}</span>
            </a>
          </div>
          <p class="text-sm text-[var(--text-muted)] mono">
            <span class="text-[var(--accent)]">©</span> {{ new Date().getFullYear() }} {{ profile?.name ?? 'Rodolfo De Bonis' }}
          </p>
          <p class="text-xs text-[var(--text-muted)]/50 mt-1 mono">
            {{ footerTagline }}
          </p>
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
  'contact-profile-fallback',
  () =>
    props.profile
      ? Promise.resolve(props.profile)
      : usePortfolio().getProfile(locale.value === 'en' ? 'en' : 'pt-BR'),
  { server: true },
)

const profile = computed(() => props.profile ?? fallbackProfile.value ?? null)

// Formspree endpoint comes from the CMS now so the contact form can
// be retargeted (e.g. project-specific funnels) without a redeploy.
// Falls back to the historical endpoint when the profile lacks one.
const formspreeAction = computed(
  () => profile.value?.formspree_endpoint ?? 'https://formspree.io/f/xrbkgpzo',
)

const footerTagline = computed(
  () => profile.value?.footer_tagline ?? t('contact.footer.tagline'),
)

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
    return [
      { name: 'GitHub', icon: 'code', url: 'https://github.com/RodolfoBonis', external: true },
      { name: 'LinkedIn', icon: 'work', url: 'https://www.linkedin.com/in/rodolfo-de-bonis/', external: true },
      { name: 'Email', icon: 'email', url: 'mailto:dev@rodolfodebonis.com.br', external: false },
    ]
  }
  return out
})
</script>
