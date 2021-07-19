<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text">正大集团</v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link :to="{ path: '/:roomId' }" class="nav-link"
      ><v-btn class="white--text" color="blueBtn"><v-icon>mdi-plus-box</v-icon>Create</v-btn></router-link
    >
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.nav-link {
  text-decoration: none;
}
</style>
