<template>
  <div>
    <client-only>
      <SocialMediaButton :icon="['fab', 'github']" link="https://github.com/RodolfoBonis"/>
      <SocialMediaButton :icon="['fab', 'linkedin']" link="https://www.linkedin.com/in/rodolfo-de-bonis/"/>
      <SocialMediaButton :icon="['fab', 'twitter']" link="https://twitter.com/RodolfoBonis"/>
      <SocialMediaButton :icon="['fas', 'envelope']" link="mailto:dev@rodolfodebonis.com.br"/>
    </client-only>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import SocialMediaButton from "~/components/SocialMediaButton.vue";

export default defineComponent({
  components: {SocialMediaButton}
})
</script>
