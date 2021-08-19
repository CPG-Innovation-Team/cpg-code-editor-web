<template>
  <v-app>
    <IndexHeader v-if="this.$route.path === '/'" :projects="project" />
    <EditorHeader v-else :users="users" :changedUserInfo="changedUserInfo" :projects="project" />
    <v-main>
      <!-- force refresh the page when at the same route -->
      <router-view
        :key="$route.fullPath"
        :projects="project"
        @passUserList="getUserList"
        @passChangedUserInfo="getChangedUserInfo"
      ></router-view>
    </v-main>
  </v-app>
</template>

<script>
import IndexHeader from './components/IndexHeader.vue';
import EditorHeader from './components/EditorHeader.vue';
import { GET_PROJECT } from './query';

export default {
  name: 'App',
  apollo: {
    project: GET_PROJECT,
  },
  components: {
    IndexHeader,
    EditorHeader,
  },
  data() {
    return {
      project: [],
      users: [],
      changedUserInfo: '',
    };
  },
  methods: {
    getChangedUserInfo(userInfo) {
      this.changedUserInfo = userInfo;
    },
    getUserList(users) {
      this.users = users;
    },
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.cursor-avatar1 {
  background: #c69430;
  width: 2px !important;
}

.cursor-avatar2 {
  background: #c6c983;
  width: 2px !important;
}

.cursor-avatar3 {
  background: #875d45;
  width: 2px !important;
}

.cursor-avatar4 {
  background: #475c93;
  width: 2px !important;
}

.cursor-avatar5 {
  background: #7baaa4;
  width: 2px !important;
}

.cursor-avatar6 {
  background: #e26d5d;
  width: 2px !important;
}
</style>
