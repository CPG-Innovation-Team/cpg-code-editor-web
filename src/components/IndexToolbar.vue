<template>
  <v-list color="primary darken-1" height="100%">
    <v-list-item-group class="list-group d-flex flex-column justify-space-between fill-height">
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
              <span>Information</span>
            </v-tooltip>
          </template>
          <Setting />
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
          <Profile @passUserInfo="updateUserInfo" />
        </v-menu>

        <v-list-item>
          <v-list-item-content style="padding: 0">
            <v-avatar v-if="getUserAvatar || userAvatar">
              <v-tooltip nudge-left="10" left>
                <template v-slot:activator="{ on, attrs }">
                  <img
                    class="user-avatar ml-1 mr-1"
                    outlined
                    :src="require('../assets/img-' + (profileAvatar || getUserAvatar || userAvatar) + '.png')"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>{{ profileAvatar || getUserName || userName }}</span>
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
import { storage } from '../util';
import Profile from './tools/Profile.vue';

export default {
  components: {
    Profile,
  },
  props: {
    userInfo: {
      userName: '',
      userAvatar: '',
    },
  },
  data() {
    return {
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
