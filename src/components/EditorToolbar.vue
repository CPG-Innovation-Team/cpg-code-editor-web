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
          <!-- help component here -->
        </v-menu>

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
                    <v-icon color="greyBtn">mdi-cog</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Setting</span>
            </v-tooltip>
          </template>
          <Setting v-on="$listeners" :projectName="projectName" :syntax="syntax" />
        </v-menu>

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
                <v-list-item v-bind="attrs" v-on="{ ...tooltip, ...menu }" @click="$emit('searchText')">
                  <v-list-item-content>
                    <v-icon color="greyBtn">mdi-magnify</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ $t('tools.search.name') }}</span>
            </v-tooltip>
          </template>
        </v-menu>

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
              <span>{{ $t(tool.tooltip) }}</span>
            </v-tooltip>
          </template>
          <div :is="tool.menu" />
        </v-menu>

        <v-tooltip nudge-right="10" left>
          <template v-slot:activator="{ on, tooltip }">
            <v-list-item v-bind="tooltip" v-on="on" @click="$emit('downloadCode')">
              <v-list-item-content>
                <v-icon color="greyBtn">mdi-download</v-icon>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ $t('tools.download.name') }}</span>
        </v-tooltip>

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
                    <v-icon color="greyBtn">mdi-video</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ $t('tools.video.name') }}</span>
            </v-tooltip>
          </template>
          <!-- video component here -->
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
                    <v-icon color="greyBtn">mdi-information</v-icon>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ $t('tools.information.name') }}</span>
            </v-tooltip>
          </template>
          <!-- information component here -->
        </v-menu>

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
          <Profile v-bind="$attrs" v-on="$listeners" @passUserInfo="updateUserInfo" />
        </v-menu>

        <v-list-item>
          <v-list-item-content style="padding: 0">
            <v-avatar v-if="getUserAvatar || userAvatar">
              <v-tooltip nudge-left="10" left>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    class="user-avatar"
                    :src="require('../assets/img-' + (profileAvatar || getUserAvatar || userAvatar) + '.png')"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>{{ profileName || getUserName || userName }}</span>
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
    projectName: { type: String },
    syntax: { type: String },
  },
  data() {
    return {
      tools: [{ icon: 'mdi-history', tooltip: 'tools.history.name', menu: History }],
      userName: '',
      userAvatar: '',
      profileName: '',
      profileAvatar: '',
    };
  },
  methods: {
    updateUserInfo(userName, userAvatar) {
      this.profileName = userName;
      this.profileAvatar = userAvatar;
    },
  },
  created() {
    this.userName = storage.getUserInfo().userName;
    this.userAvatar = storage.getUserInfo().userAvatar;
    this.$emit('download');
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
