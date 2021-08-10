<template>
  <v-app>
    <IndexHeader v-if="this.$route.path === '/'" />
    <EditorHeader v-else :users="users" :changedUserInfo="changedUserInfo" />
    <v-main>
      <!-- force refresh the page when at the same route -->
      <router-view
        :key="$route.fullPath"
        @passUserList="getUserList"
        @passChangedUserInfo="getChangedUserInfo"
      ></router-view>
    </v-main>
  </v-app>
</template>

<script>
import IndexHeader from './components/IndexHeader.vue';
import EditorHeader from './components/EditorHeader.vue';

export default {
  name: 'App',
  components: {
    IndexHeader,
    EditorHeader,
  },
  data() {
    return {
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
</style>
