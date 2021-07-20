<template>
  <div>
    <v-row style="height: 88vh" no-gutters>
      <v-col cols="11">
        <v-container>
          <h1>Code Projects</h1>
          <router-link to="/001">Editor</router-link>
        </v-container>
      </v-col>
      <v-col cols="1">
        <Toolbar />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Toolbar from '../components/Toolbar.vue';

export default {
  name: 'Projects',
  components: {
    Toolbar,
  },
};
</script>

<style scoped lang="scss"></style>
