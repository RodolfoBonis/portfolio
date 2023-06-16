<template>
  <div>
    <div
      id="about-me"
      class="flex flex-col text-center justify-center items-center py-24"
    >
      <div class="flex flex-row justify-center items-center">
        <h3 class="text-4xl sm:text-4xl md:text-5xl lg:text-6xl">
          Rodolfo De Bonis
        </h3>
      </div>

      <div class="pt-16">
        <img
          class="w-32 h-32 rounded-full object-cover"
          src="@/static/me.jpeg"
          alt=""
        />
      </div>

      <div class="pt-16">
        <p>I'm a software engineer at Brazil.</p>
        <p>Currently I have {{ age }} years old</p>
        <p>I have a degree in systems analysis and development.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      age: new Date().getFullYear() - 1996,
    }
  },
}
</script>
