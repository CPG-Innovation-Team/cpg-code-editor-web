<template>
  <div outlined class="white--text container">
    <h4 class="mb-5">Activity History</h4>
    <h5
      style="
        width: 50px;
        height: 20px;
        background-color: blue;
        text-align: center;
        border-radius: 10px;
        margin-bottom: 15px;
      "
    >
      Today
    </h5>
    <div v-for="(user, index) in editHistory" :key="index">
      <div class="historyUnit">
        <v-avatar rounded>
          <img
            class="user-avatar"
            outlined
            :src="require(`../../assets/img-${user.userAvatar}.png`)"
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
        <div style="display: inline-block">
          <div style="font-size: 14px; width: 300px">
            {{ user.editNumber }} characters edited to line {{ user.editLines }}<br />
          </div>
          <div style="font-size: 14px; width: 200px">
            {{ user.editTime }} by <a style="color: lightblue">{{ user.name }}</a>
          </div>
        </div>
      </div>
    </div>
    <v-divider style="margin-top: 10px; margin-bottom: 10px" color="black"></v-divider>
    <h5
      style="
        width: 80px;
        height: 20px;
        background-color: gray;
        text-align: center;
        border-radius: 10px;
        margin-bottom: 15px;
      "
    >
      Yesterday
    </h5>
    <div v-for="user in editHistory1" :key="user.editTime">
      <div class="historyUnit">
        <v-avatar rounded>
          <img
            class="user-avatar"
            outlined
            :src="require(`../../assets/img-${user.userAvatar}.png`)"
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
        <div style="display: inline-block">
          <div style="font-size: 14px; width: 300px">
            {{ user.editNumber }} characters edited to line {{ user.editLines }}<br />
          </div>
          <div style="font-size: 14px; width: 200px">
            {{ user.editTime }} by <a style="color: lightblue">{{ user.name }}</a>
          </div>
        </div>
        <div class="historyUnit">
          <v-avatar rounded>
            <img
              class="user-avatar"
              outlined
              :src="require(`../../assets/img-avatar1.png`)"
              :style="{
                'border-color': 'rgb(135, 93, 69)',
                filter: 'saturate(100%)',
                opacity: 1,
              }"
            />
          </v-avatar>
          <div style="display: inline-block">
            <div style="font-size: 14px; width: 300px">characters edited to line<br /></div>
            <div style="font-size: 14px; width: 200px">by <a style="color: lightblue">You</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  components: {},
  data() {
    return {
      editHistory: [
        {
          name: 'Jessie',
          userAvatar: 'avatar2',
          editTime: '15:20',
          editNumber: 10,
          editLines: '10',
          newMemberMessage: false,
          isOnline: true,
          isEditing: true,
        }, // edit Content later
        {
          name: 'Able',
          userAvatar: 'avatar3',
          editTime: '10:30',
          editNumber: 54,
          editLines: '2-5',
          newMemberMessage: false,
          isOnline: true,
          isEditing: true,
        },
      ],
      editHistory1: [
        {
          name: 'You',
          userAvatar: 'avatar1',
          editTime: '10:10',
          editNumber: 10,
          editLines: '11',
          newMemberMessage: false,
          isOnline: true,
          isEditing: true,
        },
      ],
      users: [
        { id: '01', userName: 'Mark', userAvatar: 'avatar2', isOnline: true, isEditing: false },
        { id: '02', userName: 'Jack', userAvatar: 'avatar1', isOnline: true, isEditing: true },
      ],
    };
  },
  methods: {
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
.container {
  height: 100%;
  width: 20vw;
  padding: 10%;
  background-color: #161e27;
  min-width: 240px;
  max-width: 400px;
}
.historyUnit {
  display: flex;
  margin-bottom: 5px;
}
</style>
