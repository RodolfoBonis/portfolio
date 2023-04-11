<template>
  <div>
    <client-only>
      <a href="https://github.com/RodolfoBonis" target="_blank">
        <font-awesome-icon
          class="text-white fa-lg px-3"
          :icon="['fab', 'github']"
        />
      </a>
      <a href="https://www.linkedin.com/in/rodolfo-de-bonis/" target="_blank">
        <font-awesome-icon
          class="text-white fa-lg px-3"
          :icon="['fab', 'linkedin']"
        />
      </a>
      <a href="https://twitter.com/RodolfoBonis" target="_blank">
        <font-awesome-icon
          class="text-white fa-lg px-3"
          :icon="['fab', 'twitter']"
        />
      </a>
      <a href="mailto:dev@rodolfodebonis.com.br" target="_blank">
        <font-awesome-icon
          class="text-white fa-lg px-3"
          :icon="['fas', 'envelope']"
        />
      </a>
    </client-only>
  </div>
</template>

<script>
// eslint-disable-next-line import/named
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: { FontAwesomeIcon },
}
</script>
