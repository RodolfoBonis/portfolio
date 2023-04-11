<template>
  <div>
    <div id="about-me" class="text-center py-24">
      <h3 class="text-2xl">My Name is Rodolfo De Bonis</h3>
      <p>I'm a Flutter mobile software engineer at Brazil.</p>
      <p>Currently I have {{ age }} years old</p>
      <p>I have a degree in systems analysis and development.</p>
      <p>Currently My Stack is: Flutter, Golang and VueJS</p>
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
