<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text">正大集团</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="user-status">
      <div class="user-num">
        {{
          pluralize(
            users.filter((user) => {
              return user.isOnline;
            }).length
          )
        }}
      </div>
      <UserStatus :usersList="users.slice(0, 5)" />

      <div>
        <v-menu content-class="user-menu" offset-y dark>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="users.length >= 5" class="mx-2" v-bind="attrs" v-on="on" fab dark small color="indigo">
              <v-icon dark> ... </v-icon>
            </v-btn>
          </template>
          <v-list class="user-list">
            <UserStatus :usersList="users.slice(5)" />
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-menu offset-y :close-on-content-click="false" max-height="auto" max-width="400" nudge-bottom="10">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="white--text ml-5 mr-5" color="blueBtn" v-bind="attrs" v-on="on">
          <v-icon>mdi-share</v-icon>Share
        </v-btn>
      </template>
      <div>
        <div class="bubble"></div>

        <v-container class="share-container white--text">
          <v-row>
            <v-col cols="2">
              <h3 class="mr-5">Share</h3>
            </v-col>

            <v-col>
              <h3 style="color: #bec6c9">Project name</h3>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="url"
                background-color="primary lighten-1"
                single-line
                outlined
                dark
                disabled
                hide-details="auto"
                style="border-radius: 12px"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-btn
                v-if="!copied"
                x-large
                depressed
                color="blueBtn"
                class="white--text"
                style="border-radius: 12px"
                @click="copyURL"
              >
                <v-icon small class="mr-2">mdi-content-copy</v-icon>Copy
              </v-btn>
              <v-btn
                v-else
                x-large
                depressed
                color="text darken-1"
                class="white--text"
                style="border-radius: 12px"
                @click="copyURL"
              >
                <v-icon small class="mr-2">mdi-content-copy</v-icon>Copied
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <p class="hint mx-auto">Use keyboard short cut Ctrl+V / ⌘+V to paste on your favorite way to share link.</p>
          </v-row>
        </v-container>
      </div>
    </v-menu>
  </v-app-bar>
</template>

<script>
import UserStatus from './UserStatus.vue';

export default {
  components: {
    UserStatus,
  },
  data: () => ({
    users: [
      { id: '02', userName: 'Mark', userAvatar: 'avatar2', isOnline: true, isEditing: false },
      { id: '03', userName: 'Jack', userAvatar: 'avatar1', isOnline: true, isEditing: true },
      { id: '05', userName: 'Martin', userAvatar: 'avatar3', isOnline: true, isEditing: true },
      { id: '06', userName: 'Alice', userAvatar: 'avatar6', isOnline: true, isEditing: false },
      { id: '08', userName: 'user2', userAvatar: 'avatar3', isOnline: true, isEditing: true },
      { id: '09', userName: 'user3', userAvatar: 'avatar2', isOnline: true, isEditing: false },
      { id: '14', userName: 'user8', userAvatar: 'avatar1', isOnline: true, isEditing: true },
      { id: '15', userName: 'user9', userAvatar: 'avatar3', isOnline: true, isEditing: false },
      { id: '11', userName: 'user5', userAvatar: 'avatar5', isOnline: true, isEditing: true },
      { id: '12', userName: 'user6', userAvatar: 'avatar6', isOnline: true, isEditing: false },
      { id: '13', userName: 'user7', userAvatar: 'avatar2', isOnline: false },
      { id: '04', userName: 'Lucy', userAvatar: 'avatar4', isOnline: false },
      { id: '01', userName: 'Kelly', userAvatar: 'avatar5', isOnline: false },
      { id: '07', userName: 'user1', userAvatar: 'avatar1', isOnline: false },
      { id: '10', userName: 'user4', userAvatar: 'avatar4', isOnline: false },
    ],
    url: 'https://cgp.url',
    copied: false,
  }),
  methods: {
    pluralize(length) {
      if (length === 1) {
        return '1 member online';
      }
      return `${length} members online`;
    },
    copyURL() {
      navigator.clipboard.writeText(this.url);
      this.copied = true;
    },
  },
  mounted() {
    this.url += this.$route.fullPath;
  },
};
</script>

<style scoped lang="scss">
.user-status {
  display: flex;
  align-items: center;

  .user-num {
    margin-right: 5px;
    color: white;
    font-size: 14px;
  }
}

.user-menu {
  margin-top: 10px;

  .user-list {
    width: 230px;
    justify-content: center;
  }
}

.v-menu__content {
  border-radius: 26px;
  box-shadow: 0px 14px 0px -4px #343f48;
}

.share-container {
  display: grid;
  height: 100%;
  width: 100%;
  background: #3d4b56;
  padding: 8%;
  border-radius: 26px;

  .hint {
    width: 90%;
    color: #737d81;
  }
}

.bubble {
  height: 50px;
  width: 50px;
  background: #3d4b56;
  transform: rotate(-135deg);
  border-radius: 0 0 8px 0;
  margin: 14px 0 -44px 78%;
  position: relative;
  z-index: -1;
}
</style>
