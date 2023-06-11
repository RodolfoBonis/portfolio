<script lang="ts">
// eslint-disable-next-line import/named
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: { FontAwesomeIcon },
  props: {
    link: {
      type: String,
      required: false,
      default: '',
    },
    icon: {
      type: Array<String>,
      required: true,
      default: ['fab', 'github'],
    },
  },
}
</script>

<template>
  <a :href="link" target="_blank">
    <font-awesome-icon class="text-white fa-lg px-3" :icon="icon" />
  </a>
</template>
