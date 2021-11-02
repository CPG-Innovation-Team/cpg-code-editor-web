<template>
  <div outlined class="white--text container">
    <h4 class="mb-5">{{ $t('tools.profile.userProfile') }}</h4>
    <WelcomeWindow
      v-bind="$attrs"
      v-on="$listeners"
      v-if="changeIsClicked"
      @getUserInfoChangeStatus="getIsClicked"
      @passUserInfo="getUserInfo"
    />
    <div class="user-avatar-header">
      <v-avatar>
        <img
          v-if="userAvatar"
          class="user-avatar"
          outlined
          :src="require('../../assets/img-' + userAvatar + '.png')"
          alt="user avatar"
        />
        <v-icon v-else>mdi-account-circle</v-icon>
      </v-avatar>
      <v-btn class="white--text" color="rgb(33, 48, 61)" small @click="changeIsClicked = true">
        <v-icon left dark> mdi-image </v-icon> {{ $t('tools.profile.change') }}
      </v-btn>
      <v-btn class="white--text" color="rgb(33, 48, 61)" small icon>
        <v-icon dark> mdi-delete </v-icon>
      </v-btn>
    </div>
    <div class="user-info">
      <div>{{ $t('tools.profile.name') }}</div>
      <div>
        <v-text-field
          class="mt-1"
          background-color="rgb(42,51,60)"
          dark
          solo
          v-model="userName"
          disabled
        ></v-text-field>
      </div>
      <div>{{ $t('tools.profile.email') }}</div>
      <div>
        <v-text-field
          class="mt-1"
          background-color="rgb(42,51,60)"
          dark
          solo
          v-model="userEmail"
          disabled
        ></v-text-field>
      </div>
    </div>
    <div>
      <div>{{ $t('tools.profile.language') }}</div>
      <v-select
        v-model="selected"
        class="mt-1"
        :items="languages"
        item-text="text"
        item-value="locale"
        dark
        label="Language"
        @change="changeLang(selected)"
      ></v-select>
    </div>
  </div>
</template>

<script>
import WelcomeWindow from '../../views/WelcomeWindow.vue';
import { storage } from '../../util';

export default {
  name: 'Profile',
  components: {
    WelcomeWindow,
  },
  data() {
    return {
      storage,
      userName: '',
      userAvatar: '',
      userEmail: 'example@example.com',
      selected: { text: 'English', locale: 'en-US' },
      languages: [
        { text: '简体中文', locale: 'zh-CN' },
        { text: 'English', locale: 'en-US' },
      ],
      changeIsClicked: false,
    };
  },
  methods: {
    getIsClicked() {
      this.changeIsClicked = false;
    },
    getUserInfo(userName, userAvatar) {
      this.userName = userName;
      this.userAvatar = userAvatar;
    },
    changeLang(locale) {
      this.$i18n.locale = locale;
      document.title = this.$t('title');
    },
  },
  created() {
    this.userName = storage.getUserInfo().userName;
    this.userAvatar = storage.getUserInfo().userAvatar;
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

.user-avatar-header {
  display: flex;
  align-items: center;

  .user-avatar {
    height: 40px;
    width: 40px;
  }
}

.user-info {
  margin-top: 10%;
}
</style>
