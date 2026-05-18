<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] grain">
    <PreviewBanner />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: { lang: 'pt-BR' },
})
</script>
