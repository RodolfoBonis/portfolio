<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors"
  >
    <span class="text-[var(--accent)] mono">❯</span>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      type="search"
      class="flex-1 bg-transparent outline-none mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
      :aria-label="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="modelValue"
      type="button"
      class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      :aria-label="lang === 'en' ? 'Clear search' : 'Limpar busca'"
      @click="$emit('update:modelValue', '')"
    >
      <span class="material-icons text-base">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from '~/composables/useBlog'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    lang?: Lang
  }>(),
  {
    placeholder: 'grep -r "termo" ./posts',
    lang: 'pt-BR',
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
