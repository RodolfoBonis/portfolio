<template>
  <div
    class="relative group flex flex-col items-center sr-reveal"
    :style="{ '--delay': `${delay}ms` }"
  >
    <img
      :src="stack.icon"
      :alt="stack.name"
      class="w-16 h-16 mb-2 transition-transform group-hover:scale-110"
    />
    <span class="text-sm">{{ stack.name }}</span>
    <div class="tooltip">{{ stack.tooltip }}</div>
  </div>
</template>

<script setup>
defineProps({
  stack: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: var(--card-color);
  color: var(--text-color);
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateY(0.5rem);
  transition:
    opacity 0.2s,
    transform 0.2s;
  z-index: 40;
}

.group:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
}
</style>
