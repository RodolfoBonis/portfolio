<template>
  <PageNotFound />
</template>

<script setup>
import PageNotFound from '~/components/PageNotFound.vue'

definePageMeta({
  layout: 'default',
})

setResponseStatus(useRequestEvent(), 404)
</script>
