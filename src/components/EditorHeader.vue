<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text mr-5">正大集团</v-toolbar-title>
    <v-menu
      offset-y
      min-height
      min-width="100%"
      :close-on-content-click="false"
      content-class="elevation-0 projects-menu"
      v-model="projectMenu"
    >
      <template v-slot:activator="{ on, attrs }">
        <h4 class="white--text" v-bind="attrs" v-on="on">
          Project Name <v-icon v-if="projectMenu" color="white" class="mb-1">mdi-chevron-up</v-icon>
          <v-icon v-else color="white" class="mb-1">mdi-chevron-down</v-icon>
        </h4>
      </template>
      <div class="projects-container">
        <v-row>
          <v-col cols="3">
            <div class="project"></div>
            <p>Project 1</p>
          </v-col>

          <v-col cols="3">
            <div class="project"></div>
            <p>Project 2</p>
          </v-col>

          <v-col cols="3">
            <div class="new-project">
              <v-icon class="plus-icon" color="greyBtn">mdi-plus-box</v-icon>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-menu>

    <v-spacer></v-spacer>
    <div class="user-status">
      <div class="user-num" v-show="usersList.length > 0">
        {{
          pluralize(
            usersList.filter((user) => {
              return user.isOnline;
            }).length
          )
        }}
      </div>
      <UserStatus :usersList="usersList.slice(0, index)" />

      <div>
        <v-menu content-class="user-menu" offset-y dark>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="usersList.length >= index"
              class="mx-2"
              v-bind="attrs"
              v-on="on"
              fab
              dark
              depressed
              small
              color="indigo"
            >
              <v-icon dark> ... </v-icon>
            </v-btn>
          </template>
          <v-list class="user-list">
            <UserStatus :usersList="usersList.slice(index)" />
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-menu
      offset-y
      :close-on-content-click="false"
      max-height="auto"
      max-width="400"
      nudge-bottom="10"
      content-class="share-menu"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="white--text ml-5 mr-5" color="blueBtn" v-bind="attrs" v-on="on">
          <v-icon>mdi-share</v-icon>{{ $t('header.share.name') }}
        </v-btn>
      </template>
      <div>
        <div class="bubble"></div>

        <v-container class="share-container white--text">
          <v-row>
            <v-col cols="3">
              <h3 class="mr-5">{{ $t('header.share.name') }}</h3>
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
                <v-icon small class="mr-2">mdi-content-copy</v-icon>{{ $t('header.share.copy') }}
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
                <v-icon small class="mr-2">mdi-content-copy</v-icon>{{ $t('header.share.copied') }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <p class="hint mx-auto">{{ $t('header.share.hint') }}</p>
          </v-row>
        </v-container>
      </div>
    </v-menu>
  </v-app-bar>
</template>

<script>
import UserStatus from './UserStatus.vue';
import { GET_USER_LIST } from '../query';

export default {
  components: {
    UserStatus,
  },
  props: {
    changedUserInfo: {
      userName: '',
      userAvatar: '',
    },
    users: Array,
  },

  data() {
    return {
      projectMenu: false,
      index: document.body.clientWidth / 320,
      clientWidth: document.body.clientWidth,
      url: 'https://cgp.url',
      copied: false,
      usersList: [],
    };
  },
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
    // watch the width of the window
    const that = this;
    window.onresize = () => {
      return (() => {
        window.clientWidth = document.body.clientWidth;
        that.clientWidth = window.clientWidth;
      })();
    };
  },
  watch: {
    clientWidth(newVal) {
      this.index = newVal / 320;
    },
    users(newVal) {
      this.usersList = newVal;
    },
    async changedUserInfo() {
      await this.$apollo
        .query({
          query: GET_USER_LIST,
          variables: { _id: this.$route.path.slice(1) },
        })
        .then((response) => {
          this.usersList = response.data.project[0].editInfo;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.projects-menu {
  top: 64px !important;
}

.projects-container {
  padding: 30px 30px 10px 30px;
  background-color: #24303c;
  color: white;
  border-top: 1px solid white;
  overflow: hidden;

  .project {
    height: 150px;
    width: 200px;
    background-color: #2c333b;
    margin-bottom: 10px;
    border: 1px solid white;
    cursor: pointer;

    &:hover {
      border: 1px solid #537cd6;
    }
  }

  .new-project {
    display: flex;
    justify-content: center;
    height: 150px;
    width: 200px;
    background-color: #1f2933;
    margin-bottom: 10px;
    cursor: pointer;

    .plus-icon {
      font-size: 72px;
    }

    &:hover {
      border: 1px solid #537cd6;
    }
  }
}

.user-status {
  display: flex;
  align-items: center;

  .user-num {
    margin-right: 5px;
    color: white;
    font-size: 12px;
  }
}

.user-menu {
  margin-top: 20px;

  .user-list {
    width: 230px;
    justify-content: center;
    background-color: #3d4b56;
  }
}

.user-info {
  color: white;
}

.share-menu {
  border-radius: 26px;
  box-shadow: 0px 14px 0px -4px #343f48;
}

.share-container {
  display: grid;
  height: 100%;
  width: 100%;
  min-width: 400px;
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
