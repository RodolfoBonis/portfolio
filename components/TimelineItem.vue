<template>
  <div
    class="mb-10 ml-4 sr-reveal relative"
    :style="{ '--delay': `${delay}ms` }"
  >
    <div
      class="absolute w-4 h-4 bg-[var(--accent-color)] rounded-full -left-6 border-2 border-[var(--card-color)]"
    ></div>
    <p class="text-sm text-[var(--accent-light)]">{{ item.period }}</p>
    <h3 class="text-xl font-medium text-[var(--heading-color)]">
      {{ item.title }}
    </h3>
    <div class="mt-2 text-sm text-[var(--text-color)]">
      <p v-if="!item.list">{{ item.description }}</p>
      <template v-else>
        <p>{{ item.description }}</p>
        <ul class="list-disc list-inside mt-2">
          <li v-for="(listItem, index) in item.list" :key="index">
            {{ listItem }}
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
})
</script>
