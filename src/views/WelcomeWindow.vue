<template>
  <div>
    <div class="text-center">
      <v-dialog v-model="dialog" dark persistent overlay-opacity="0.8" width="350">
        <v-card color="rgb(58,75,87)">
          <v-card-title class="text-h5"> Hellooooooo </v-card-title>
          <v-card-text>
            Please enter your name and select avatar to continue
            <v-text-field
              class="mt-6"
              placeholder="Your name"
              :rules="rules"
              solo
              clearable
              background-color="rgb(42,51,60)"
              hide-details="auto"
              persistent-placeholder
              rounded
              v-model="userName"
              @keyup.enter="
                if (checkValidName(userName)) {
                  dialog = false;
                  submit(userName);
                  passUserInfo(userName, userAvatar || 'avatar1');
                  userInfoChanged(true);
                }
              "
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
              :disabled="checkValidName(userName) === false"
              @click="
                dialog = false;
                submit(userName);
                passUserInfo(userName, userAvatar || 'avatar1');
                userInfoChanged(true);
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
import { storage } from '../util';
import { CREATE_USER } from '../query';

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
  props: {
    userInfo: {
      userName: '',
      userAvatar: '',
    },
  },
  data() {
    return {
      dialog: true,
      rules: [
        (value) => !!value || 'This field is required',
        (value) =>
          (value && value.trim().length >= 2 && value.trim().length <= 50) || 'Min 2 characters, max 50 characters',
      ],
      userName: '',
      userAvatar: '',
      userID: '',
      avatars: [avatar1Selected, avatar2, avatar3, avatar4, avatar5, avatar6],
    };
  },
  created() {
    // retreive user data from local storage
    this.userName = storage.getUserInfo().userName;
    this.userAvatar = storage.getUserInfo().userAvatar;
    if (this.userAvatar) {
      this.selectAvatar(parseInt(this.userAvatar.substring(6) - 1, 10));
    }
  },
  methods: {
    submit(userName) {
      // save user data to local storage
      this.$apollo
        .mutate({
          mutation: CREATE_USER,
          variables: { userName: this.userName, avatar: this.userAvatar },
        })
        .then((res) => {
          console.log(res);
          this.userName = userName.trim();
          this.userID = res.data.createUser.userId;
          storage.setUserInfo(this.userName, this.userAvatar || 'avatar1', this.userID);
        });
    },
    checkValidName(userName) {
      if (userName && userName.trim() !== '' && userName.trim().length <= 50 && userName.trim().length >= 2)
        return true;
      return false;
    },
    passUserInfo(userName, userAvatar) {
      this.$emit('passUserInfo', userName, userAvatar);
    },
    userInfoChanged(bool) {
      this.$emit('getUserInfoChangeStatus', bool);
    },
    selectAvatar(index) {
      this.avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];
      switch (index) {
        case 1:
          this.avatars.splice(1, 1, avatar2Selected);
          this.userAvatar = 'avatar2';
          break;
        case 2:
          this.avatars.splice(2, 1, avatar3Selected);
          this.userAvatar = 'avatar3';
          break;
        case 3:
          this.avatars.splice(3, 1, avatar4Selected);
          this.userAvatar = 'avatar4';
          break;
        case 4:
          this.avatars.splice(4, 1, avatar5Selected);
          this.userAvatar = 'avatar5';
          break;
        case 5:
          this.avatars.splice(5, 1, avatar6Selected);
          this.userAvatar = 'avatar6';
          break;
        default:
          this.avatars.splice(0, 1, avatar1Selected);
          this.userAvatar = 'avatar1';
      }
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
