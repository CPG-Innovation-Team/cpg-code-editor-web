<template>
  <v-app>
    <IndexHeader v-if="this.$route.path === '/'" :projects="project" />
    <EditorHeader
      v-else
      :users="users"
      :changedUserInfo="changedUserInfo"
      :projects="project"
      :projectName="projectName"
    />
    <v-main>
      <!-- force refresh the page when at the same route -->
      <router-view
        :key="$route.fullPath"
        :projects="project"
        @passUserList="getUserList"
        @passChangedUserInfo="getChangedUserInfo"
        @changeProjectName="changeProjectName"
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
      projectName: '',
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
    changeProjectName(value) {
      this.projectName = value;
    },
  },
  mounted() {
    console.log('PROCESS ENV----->', process.env);
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

.cursor-avatar {
  width: 2px !important;

  &.avatar1 {
    background: #c69430;
  }

  &.avatar2 {
    background: #c6c983;
  }

  &.avatar3 {
    background: #875d45;
  }

  &.avatar4 {
    background: #475c93;
  }

  &.avatar5 {
    background: #7baaa4;
  }

  &.avatar6 {
    background: #e26d5d;
  }
}
</style>
