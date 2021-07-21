<template>
  <v-list color="primary darken-1" height="100%">
    <v-list-item-group class="list-group d-flex flex-column justify-space-between fill-height">
      <div>
        <v-menu
          left
          offset-x
          :close-on-content-click="false"
          content-class="elevation-0 tool-menu"
          z-index="1"
          rounded="0"
        >
          <template v-slot:activator="{ on: menu, attrs }" class="tool-menu">
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

        <v-menu
          v-for="tool in tools"
          :key="tool.index"
          left
          offset-x
          :close-on-content-click="false"
          content-class="elevation-0 tool-menu"
          z-index="1"
          rounded="0"
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip nudge-right="10" left>
              <template v-slot:activator="{ on: tooltip }">
                <v-list-item v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-list-item-content>
                    <v-icon color="greyBtn">{{ tool.icon }}</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ tool.tooltip }}</span>
            </v-tooltip>
          </template>
          <div :is="tool.menu" />
        </v-menu>
      </div>

      <div class="mt-auto">
        <v-divider color="#737d81" class="toolbar-divider"></v-divider>

        <v-menu
          left
          offset-x
          :close-on-content-click="false"
          content-class="elevation-0 tool-menu"
          z-index="1"
          rounded="0"
        >
          <template v-slot:activator="{ on: menu, attrs }" class="tool-menu">
            <v-tooltip nudge-right="10" left>
              <template v-slot:activator="{ on: tooltip }">
                <v-list-item v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-list-item-content>
                    <v-icon color="greyBtn">mdi-tune</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Language</span>
            </v-tooltip>
          </template>
          <Profile />
        </v-menu>

        <v-list-item>
          <v-list-item-content>
            <v-avatar v-if="getUserAvatar || userAvatar">
              <v-tooltip nudge-left="10" left>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    class="user-avatar ml-1 mr-1"
                    outlined
                    :src="require('../assets/img-' + (getUserAvatar || userAvatar) + '.png')"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>{{ getUserName || userName }}</span>
              </v-tooltip>
            </v-avatar>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script>
import Setting from './tools/Setting.vue';
import { storage } from '../util';
import Profile from './tools/Profile.vue';
import History from './tools/History.vue';

export default {
  name: 'Toolbar',
  components: {
    Setting,
    Profile,
    History,
  },
  props: {
    userInfo: {
      userName: '',
      userAvatar: '',
    },
  },
  data() {
    return {
      tools: [
        { icon: 'mdi-cog', tooltip: 'Settiing', menu: Setting },
        { icon: 'mdi-magnify', tooltip: 'Search', menu: Setting },
        { icon: 'mdi-history', tooltip: 'History', menu: History },
        { icon: 'mdi-download', tooltip: 'Download', menu: Setting },
        { icon: 'mdi-video', tooltip: 'Something', menu: Setting },
      ],
      userName: '',
      userAvatar: '',
    };
  },
  created() {
    this.userName = storage.getUserInfo().userName;
    this.userAvatar = storage.getUserInfo().userAvatar;
  },
  computed: {
    getUserAvatar() {
      if (this.userInfo) {
        return this.userInfo.userAvatar;
      }
      return this.userAvatar;
    },
    getUserName() {
      if (this.userInfo) {
        return this.userInfo.userName;
      }
      return this.userName;
    },
  },
};
</script>

<style scoped lang="scss">
.list-group .v-list-item--active {
  background-color: #161e27;
  color: #161e27;
}

.tool-menu {
  top: 64px !important;
  bottom: 0px;
}

.toolbar-divider {
  margin: auto;
  width: 40%;
}

.user-avatar {
  height: 35px;
  width: 35px;
}
</style>
