<template>
  <component
    :is="href ? 'NuxtLink' : 'span'"
    :to="href"
    :class="[
      'inline-flex items-center px-2.5 py-1 rounded-md text-xs mono transition-colors',
      active
        ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/40'
        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]',
    ]"
  >
    #{{ label }}
  </component>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  href?: string
  active?: boolean
}>()
</script>
