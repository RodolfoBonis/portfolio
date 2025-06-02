<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <a
    :href="url"
    target="_blank"
    class="text-[var(--text-color)] hover:text-[var(--accent-light)] text-2xl transition-colors"
    :title="name"
  >
    <span class="material-icons">{{ icon }}</span>
  </a>
</template>
