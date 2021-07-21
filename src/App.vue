<template>
  <v-app>
    <HeaderA v-if="this.$route.path === '/'" />
    <HeaderB v-else />
    <v-main>
      <!-- force refresh the page when at the same route -->
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import HeaderA from './components/HeaderA.vue';
import HeaderB from './components/HeaderB.vue';

export default {
  name: 'App',
  components: {
    HeaderA,
    HeaderB,
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
