<template>
  <div class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
    <NuxtPage />
  </div>
</template>

<script setup>
// Importações automáticas do Nuxt
</script>

<style>
/* Variáveis CSS para temas */
:root {
  --bg-color: #0d1117;
  --card-color: #161b22;
  --border-color: #30363d;
  --text-color: #c9d1d9;
  --heading-color: #f0f6fc;
  --accent-color: #58a6ff;
  --accent-light: #79c0ff;
}

.light-mode {
  --bg-color: #fff;
  --card-color: #f6f8fa;
  --border-color: #30363d;
  --text-color: #24292f;
  --heading-color: #0d1117;
  --accent-color: #0366d6;
  --accent-light: #0366d6;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Estilos globais */
body {
  font-family: Inter, sans-serif;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: Poppins, sans-serif;
}

/* Botão Voltar ao Topo */
#btn-back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--accent-color);
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgb(0 0 0 / 30%);
  z-index: 50;
  transition: background-color 0.3s;
}

#btn-back-to-top:hover {
  background-color: var(--accent-light);
}
</style>
