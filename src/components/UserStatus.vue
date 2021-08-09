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
</template>

<script>
export default {
  props: ['usersList'],
  data() {
    return {
      users: this.usersList,
    };
  },
  watch: {
    usersList(newVal) {
      this.users = newVal;
    },
  },
  methods: {
    getColor(user) {
      if (user.avatar === 'avatar1') {
        return 'rgb(198, 148, 48)';
      }
      if (user.avatar === 'avatar2') {
        return 'rgb(198, 201, 131)';
      }
      if (user.avatar === 'avatar3') {
        return 'rgb(135, 93, 69)';
      }
      if (user.avatar === 'avatar4') {
        return 'rgb(71, 92, 147)';
      }
      if (user.avatar === 'avatar5') {
        return 'rgb(123, 170, 164)';
      }
      return 'rgb(226, 109, 93)';
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
