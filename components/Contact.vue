<template>
  <section id="contact" class="py-24">
    <div class="glow-line mb-24"></div>
    <div class="section-container">
      <div class="max-w-2xl mx-auto text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="mono text-[var(--accent)] text-sm">05.</span>
          <h2 class="text-3xl md:text-4xl font-bold">Fale Comigo</h2>
        </div>
        <p class="text-[var(--text-muted)] mb-12">
          Tem um projeto em mente, precisa de consultoria DevOps, ou quer trocar ideia sobre D&D?
          <br />
          <span class="text-[var(--text-secondary)]">Manda uma mensagem — eu respondo!</span>
        </p>

        <form
          action="https://formspree.io/f/xrbkgpzo"
          method="POST"
          class="space-y-5 text-left"
        >
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs mono text-[var(--text-muted)] mb-2">nome</label>
              <input
                type="text"
                name="name"
                required
                class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label class="block text-xs mono text-[var(--text-muted)] mb-2">email</label>
              <input
                type="email"
                name="email"
                required
                class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs mono text-[var(--text-muted)] mb-2">assunto</label>
            <input
              type="text"
              name="subject"
              required
              class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
              placeholder="Sobre o que quer conversar?"
            />
          </div>
          <div>
            <label class="block text-xs mono text-[var(--text-muted)] mb-2">mensagem</label>
            <textarea
              name="message"
              rows="5"
              required
              class="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-none"
              placeholder="Sua mensagem..."
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--bg-primary)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <span class="material-icons text-lg">send</span>
            Enviar Mensagem
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-20 pt-8 border-t border-[var(--border)]">
          <div class="flex justify-center gap-6 mb-6">
            <a
              v-for="social in socials"
              :key="social.url"
              :href="social.url"
              target="_blank"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              :title="social.name"
            >
              <span class="material-icons">{{ social.icon }}</span>
            </a>
          </div>
          <p class="text-sm text-[var(--text-muted)] mono">
            <span class="text-[var(--accent)]">©</span> {{ new Date().getFullYear() }} Rodolfo De Bonis
          </p>
          <p class="text-xs text-[var(--text-muted)]/50 mt-1 mono">
            Feito com ☕ e paixão por código
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const socials = [
  { name: 'GitHub', icon: 'code', url: 'https://github.com/RodolfoBonis' },
  { name: 'LinkedIn', icon: 'work', url: 'https://www.linkedin.com/in/rodolfo-de-bonis/' },
  { name: 'X', icon: 'rocket_launch', url: 'https://x.com/RodolfoBonis' },
  { name: 'Email', icon: 'email', url: 'mailto:dev@rodolfodebonis.com.br' },
]
</script>
