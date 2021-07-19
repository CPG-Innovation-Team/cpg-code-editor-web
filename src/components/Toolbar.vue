<template>
  <v-list color="primary darken-1" height="100%">
    <v-list-item-group>
      <v-list-item>
        <v-list-item-content>
          <v-icon color="blueBtn">mdi-help-box</v-icon>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-item v-for="icon in icons" :key="icon.index">
        <v-list-item-content>
          <v-icon color="greyBtn">{{ icon }}</v-icon>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-icon color="greyBtn">mdi-information</v-icon>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-icon color="greyBtn">mdi-tune</v-icon>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'Toolbar',
  data() {
    return {
      icons: ['mdi-cog', 'mdi-magnify', 'mdi-history', 'mdi-download', 'mdi-video'],
    };
  },
};
</script>
