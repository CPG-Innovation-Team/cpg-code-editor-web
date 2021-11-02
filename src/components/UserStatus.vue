<template>
  <div class="user-list">
    <div v-for="(user, index) in users" :key="index">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar rounded>
            <img
              class="user-avatar"
              outlined
              :src="require(`../assets/img-${user.avatar}.png`)"
              alt="user avatar"
              v-bind="attrs"
              v-on="on"
              :style="{
                'border-color': getAvatarColor(user.avatar),
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
</template>

<script>
import { getAvatarColor } from '../util';

export default {
  props: ['usersList'],
  data() {
    return {
      users: this.usersList,
      getAvatarColor,
    };
  },
  watch: {
    usersList(newVal) {
      this.users = newVal;
    },
  },
};
</script>

<style scoped lang="scss">
.user-list {
  display: flex;
  flex-flow: row wrap;
}

.user-avatar {
  height: 40px;
  width: 40px;
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
</style>
