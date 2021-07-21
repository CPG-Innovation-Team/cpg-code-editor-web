<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text">正大集团</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="user-status" v-if="this.$route.path !== '/'">
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
    <v-btn class="white--text ml-2" color="blueBtn"> <v-icon>mdi-plus-box</v-icon>Create</v-btn>
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
</style>
