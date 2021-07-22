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
      <div v-for="(user, index) in users" :key="index">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar rounded>
              <img
                class="user-avatar ml-1 mr-1"
                outlined
                :src="require(`../assets/img-${user.userAvatar}.png`)"
                v-bind="attrs"
                v-on="on"
                :style="{
                  'border-color': getColor(user),
                  filter: user.isOnline ? 'saturate(100%)' : 'saturate(10%)',
                  opacity: user.isOnline ? 1 : 0.5,
                }"
              />
              <div
                v-if="user.isOnline"
                class="user-editing-status"
                :style="{ 'background-color': user.isEditing ? 'rgb(221, 115, 55)' : 'rgb(107, 189, 115)' }"
              ></div>
            </v-avatar>
          </template>
          <span>{{ user.userName }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-menu
      offset-y
      :close-on-content-click="false"
      max-height="auto"
      max-width="400"
      nudge-bottom="10"
      content-class="elevation-0"
    >
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
export default {
  name: 'Header',
  data: () => ({
    users: [
      { id: '01', userName: 'Kelly', userAvatar: 'avatar5', isOnline: false },
      { id: '02', userName: 'Mark', userAvatar: 'avatar2', isOnline: true, isEditing: false },
      { id: '03', userName: 'Jack', userAvatar: 'avatar1', isOnline: true, isEditing: true },
      { id: '04', userName: 'Lucy', userAvatar: 'avatar4', isOnline: false },
      { id: '05', userName: 'Martin', userAvatar: 'avatar3', isOnline: true, isEditing: true },
      { id: '06', userName: 'Alice', userAvatar: 'avatar6', isOnline: true, isEditing: false },
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
    getColor(user) {
      if (user.userAvatar === 'avatar1') {
        return 'rgb(198, 148, 48)';
      }
      if (user.userAvatar === 'avatar2') {
        return 'rgb(198, 201, 131)';
      }
      if (user.userAvatar === 'avatar3') {
        return 'rgb(135, 93, 69)';
      }
      if (user.userAvatar === 'avatar4') {
        return 'rgb(71, 92, 147)';
      }
      if (user.userAvatar === 'avatar5') {
        return 'rgb(123, 170, 164)';
      }
      return 'rgb(226, 109, 93)';
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

  .user-avatar {
    height: 40px;
    border: 2px solid;
    border-radius: 50%;
    padding: 3px;
  }

  .user-editing-status {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    top: 4px;
    right: 4px;
  }
}

.user-info {
  color: white;
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
