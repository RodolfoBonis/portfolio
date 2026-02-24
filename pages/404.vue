<template>
  <div class="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4">
    <div class="max-w-lg text-center space-y-6">
      <div class="mono text-6xl font-bold text-[var(--accent)]">404</div>
      <h1 class="text-2xl font-semibold text-[var(--text-primary)]">Página não encontrada</h1>
      <p class="text-[var(--text-muted)] mono text-sm">
        <span class="text-[var(--accent)]">❯</span> Error: ENOENT — rota não existe.
      </p>
      <a
        href="/"
        class="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
      >
        <span class="material-icons text-lg">home</span>
        Voltar ao início
      </a>
    </div>
  </div>
</template>
