<template>
  <v-app>
    <IndexHeader v-if="this.$route.path === '/'" v-bind:projects="project" />
    <EditorHeader v-else />
    <v-main>
      <!-- force refresh the page when at the same route -->
      <router-view :key="$route.fullPath" :projects="project"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import IndexHeader from './components/IndexHeader.vue';
import EditorHeader from './components/EditorHeader.vue';
import { GET_PROJECT } from './query';

export default {
  name: 'App',
  data() {
    return {
      project: [],
    };
  },
  apollo: {
    project: GET_PROJECT,
  },
  components: {
    IndexHeader,
    EditorHeader,
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
