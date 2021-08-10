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
  mounted() {
    console.log(this.project);
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
</style>
