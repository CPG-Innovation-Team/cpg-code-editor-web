<template>
  <v-app>
    <Header />
    <v-main>
      <v-row style="height: 100%" no-gutters>
        <v-col cols="11">
          <!-- force refresh the page when at the same route -->
          <router-view :key="$route.fullPath"></router-view>
        </v-col>
        <v-col cols="1">
          <Toolbar />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Toolbar from './components/Toolbar.vue';

export default {
  name: 'App',
  components: {
    Header,
    Toolbar,
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
