<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text">正大集团</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="user-status">
      <div class="user-num">
        {{ pluralize(users.length) }}
      </div>

      <div v-for="(user, index) in users" :key="index">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              class="ml-1 mr-1"
              max-height="40"
              max-width="40"
              :src="require(`../assets/img-${user.userAvatar}-selected.png`)"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <span>{{ user.userName }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-img
          class="ml-1 mr-1"
          max-height="40"
          max-width="40"
          :src="require(`../assets/img-${userAvatar}-selected.png`)"
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <span>{{ userName }}</span>
    </v-tooltip>

    <v-btn class="white--text ml-2" color="blueBtn"> <v-icon>mdi-plus-box</v-icon>Create</v-btn>
  </v-app-bar>
</template>

<script>
import Bus from '../bus';

export default {
  name: 'Header',
  data: () => ({
    userName: '',
    userAvatar: 'avatar1',
    users: [
      { id: '01', userName: 'Kelly', userAvatar: 'avatar5' },
      { id: '02', userName: 'Mark', userAvatar: 'avatar2' },
      { id: '03', userName: 'Jack', userAvatar: 'avatar1' },
      { id: '04', userName: 'Lucy', userAvatar: 'avatar6' },
      { id: '05', userName: 'Martin', userAvatar: 'avatar3' },
      { id: '06', userName: 'Luke', userAvatar: 'avatar1' },
    ],
  }),
  created() {
    if (localStorage.userName) {
      this.userName = localStorage.userName;
    }
    if (localStorage.avatar) {
      this.userAvatar = localStorage.avatar;
    }
  },
  mounted() {
    const vm = this;
    Bus.$on('userName', (data) => {
      vm.userName = data;
    });
    Bus.$on('userAvatar', (data) => {
      vm.userAvatar = data;
    });
  },
  methods: {
    pluralize(length) {
      if (length === 1) {
        return '1 member online';
      }
      return `${length} members online`;
    },
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

.user-info {
  color: white;
}
</style>
