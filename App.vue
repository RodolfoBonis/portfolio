<template>
  <div>
    <MainHeader />
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import { createRouter, createMemoryHistory } from 'vue-router'
import Index from '~/pages/index.vue'
import MainHeader from '~/components/MainHeader.vue'

createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: Index,
    },
  ],
})
</script>
