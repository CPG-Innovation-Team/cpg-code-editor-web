<template>
  <div>
    <div class="text-center">
      <v-dialog v-model="dialog" dark persistent width="350">
        <v-card color="rgb(58,75,87)">
          <v-card-title class="text-h5"> Hellooooooo </v-card-title>
          <v-card-text>
            Please enter your name and select avatar to continue
            <v-text-field
              class="mt-6"
              placeholder="Your name"
              :rules="rules"
              solo
              background-color="rgb(42,51,60)"
              hide-details="auto"
              persistent-placeholder
              rounded
              v-model="inputName"
            ></v-text-field>
            <div class="avatar-container">
              <div v-for="(avatar, index) in avatars" :key="index">
                <img class="avatar" :src="avatar" @click="selectAvatar(index)" />
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="white--text"
              color="blueBtn"
              @click="
                dialog = false;
                submit(inputName);
                passUserInfo();
              "
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import Bus from '../bus';

const avatar1 = require('../assets/img-avatar1.png');
const avatar2 = require('../assets/img-avatar2.png');
const avatar3 = require('../assets/img-avatar3.png');
const avatar4 = require('../assets/img-avatar4.png');
const avatar5 = require('../assets/img-avatar5.png');
const avatar6 = require('../assets/img-avatar6.png');

const avatar1Selected = require('../assets/img-avatar1-selected.png');
const avatar2Selected = require('../assets/img-avatar2-selected.png');
const avatar3Selected = require('../assets/img-avatar3-selected.png');
const avatar4Selected = require('../assets/img-avatar4-selected.png');
const avatar5Selected = require('../assets/img-avatar5-selected.png');
const avatar6Selected = require('../assets/img-avatar6-selected.png');

export default {
  name: 'WelcomeWindow',
  data() {
    return {
      dialog: true,
      rules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 2 && value.length <= 50) || 'Min 2 characters, max 50 characters.',
      ],
      inputName: '',
      inputAvatar: '',
      userName: '',
      userAvatar: 'avatar1',
      avatars: [avatar1Selected, avatar2, avatar3, avatar4, avatar5, avatar6],
    };
  },
  created() {
    // retrieve user data from local storage
    if (localStorage.userName) {
      this.userName = localStorage.userName;
    }
    if (localStorage.inputName) {
      this.inputName = localStorage.inputName;
    }
    if (localStorage.avatar) {
      this.userAvatar = localStorage.avatar;
      this.selectAvatar(parseInt(localStorage.avatar.substring(6) - 1, 10));
    }
  },
  methods: {
    submit(inputName) {
      // save user data to local storage
      this.userName = inputName;
      localStorage.userName = this.userName;
      localStorage.inputName = inputName;
      this.userAvatar = this.inputAvatar;
      localStorage.avatar = this.userAvatar;
    },
    selectAvatar(index) {
      this.avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];
      switch (index) {
        case 1:
          this.avatars.splice(1, 1, avatar2Selected);
          this.inputAvatar = 'avatar2';
          break;
        case 2:
          this.avatars.splice(2, 1, avatar3Selected);
          this.inputAvatar = 'avatar3';
          break;
        case 3:
          this.avatars.splice(3, 1, avatar4Selected);
          this.inputAvatar = 'avatar4';
          break;
        case 4:
          this.avatars.splice(4, 1, avatar5Selected);
          this.inputAvatar = 'avatar5';
          break;
        case 5:
          this.avatars.splice(5, 1, avatar6Selected);
          this.inputAvatar = 'avatar6';
          break;
        default:
          this.avatars.splice(0, 1, avatar1Selected);
          this.inputAvatar = 'avatar1';
      }
    },
    passUserInfo() {
      Bus.$emit('userName', this.userName);
      Bus.$emit('userAvatar', this.userAvatar);
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-container {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  margin-top: 25px;

  .avatar {
    height: 40px;
    margin: 3px;
  }
}
</style>
