<template>
  <v-list color="primary darken-1" height="100%">
    <v-list-item-group class="d-flex flex-column justify-space-between fill-height">
      <div>
        <v-menu left offset-x :close-on-content-click="false" content-class="elevation-0" nudge-top="6">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip nudge-right="10" left>
              <template v-slot:activator="{ on: tooltip }">
                <v-list-item v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-list-item-content>
                    <v-icon color="blueBtn">mdi-help-box</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Help</span>
            </v-tooltip>
          </template>
          <Setting />
        </v-menu>

        <v-divider color="#737d81" class="toolbar-divider"></v-divider>

        <v-list-item v-for="tool in tools" :key="tool.index">
          <v-list-item-content>
            <v-tooltip nudge-right="10" left>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="greyBtn" v-bind="attrs" v-on="on">{{ tool.icon }}</v-icon>
              </template>
              <span>{{ tool.tooltip }}</span>
            </v-tooltip>
          </v-list-item-content>
        </v-list-item>
      </div>

      <div class="mt-auto">
        <v-divider color="#737d81" class="toolbar-divider"></v-divider>

        <v-list-item>
          <v-list-item-content class="">
            <v-tooltip nudge-right="10" left>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="greyBtn" v-bind="attrs" v-on="on">mdi-tune</v-icon>
              </template>
              <span>Language</span>
            </v-tooltip>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script>
import Setting from './tools/Setting.vue';

export default {
  name: 'Toolbar',
  components: {
    Setting,
  },
  data() {
    return {
      tools: [
        { icon: 'mdi-cog', tooltip: 'Settiing' },
        { icon: 'mdi-magnify', tooltip: 'Search' },
        { icon: 'mdi-history', tooltip: 'History' },
        { icon: 'mdi-download', tooltip: 'Download' },
        { icon: 'mdi-video', tooltip: 'Something' },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.toolbar-divider {
  margin: auto;
  width: 40%;
}
</style>
