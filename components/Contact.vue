<template>
  <section id="contact" class="py-20 px-4 bg-[var(--bg-color)]">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl font-semibold text-[var(--heading-color)] mb-8">
        Fale Comigo
      </h2>
      <p class="text-sm mb-6 text-[var(--text-color)]">
        Tem um desafio DevOps, quer trocar ideias sobre IA ou simplesmente bater
        papo sobre RPG? Conecte-se!
      </p>
      <form
        action="https://formspree.io/f/xrbkgpzo"
        method="POST"
        class="space-y-6"
      >
        <div class="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            required
            class="w-full bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--accent-color)] outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            class="w-full bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--accent-color)] outline-none"
          />
        </div>
        <input
          type="text"
          name="subject"
          placeholder="Assunto"
          required
          class="w-full bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--accent-color)] outline-none"
        />
        <textarea
          name="message"
          rows="5"
          placeholder="Sua mensagem..."
          required
          class="w-full bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--accent-color)] outline-none"
        ></textarea>
        <button
          type="submit"
          class="bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent-light)] transition"
        >
          Enviar Mensagem
        </button>
      </form>

      <!-- Redes Sociais -->
      <div class="mt-12 flex justify-center space-x-6">
        <SocialMediaButton
          v-for="social in socials"
          :key="social.name"
          :name="social.name"
          :icon="social.icon"
          :url="social.url"
        />
      </div>

      <p class="mt-8 text-sm text-gray-500">
        © {{ new Date().getFullYear() }} Rodolfo De Bonis. Desenvolvido com ☕
        e muita paixão por códigos.
      </p>
    </div>
  </section>
</template>

<script setup>
const socials = [
  {
    name: 'GitHub',
    icon: 'code',
    url: 'https://github.com/RodolfoBonis',
  },
  {
    name: 'LinkedIn',
    icon: 'work',
    url: 'https://www.linkedin.com/in/rodolfo-de-bonis/',
  },
  {
    name: 'X',
    icon: 'rocket_launch',
    url: 'https://x.com/RodolfoBonis',
  },
  {
    name: 'Email',
    icon: 'email',
    url: 'mailto:dev@rodolfodebonis.com.br',
  },
]
</script>
