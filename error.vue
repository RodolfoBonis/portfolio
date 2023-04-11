<template>
  <PageNotFound v-if="error.statusCode === 404" />
</template>

<script>
import PageNotFound from '~/components/PageNotFound.vue'

export default {
  components: { PageNotFound },
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: Object,
    },
  }, // you can set a custom layout for the error page
}
</script>
