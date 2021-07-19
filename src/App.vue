<template>
  <v-app>
    <Project />
    <!-- <Editor /> -->
  </v-app>
</template>

<script>
import Project from './views/Projects.vue';

export default {
  name: 'App',
  components: {
    Project,
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
