<template>
  <v-row style="height: 100%" no-gutters>
    <v-col cols="11">
      <WelcomeWindow v-if="!userID" :userInfo="userInfo" @passUserInfo="getUserInfo" />
      <div class="project-list-container">
        <div class="title">
          <div class="title-text">Code Projects</div>
        </div>
        <div class="table-container">
          <v-data-table
            hide-default-header
            :headers="headers"
            :items="projects"
            :items-per-page="7"
            class="project-list-table tableBackground"
          >
            <template v-slot:header="{ props: { headers } }">
              <tr class="table-header">
                <td v-for="header in headers" v-bind:key="header.value" style="padding-left: 15px">
                  {{ header.text }}
                </td>
              </tr>
            </template>

            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item, index) in items" :key="item._id" class="table-row">
                  <td class="item-style">
                    <v-checkbox
                      :on-icon="'mdi-star'"
                      :off-icon="'mdi-star-outline'"
                      color="yellow"
                      small
                      class="star-checkbox"
                      v-model="item.isTop"
                      @click="updateProject(item._id, item.isTop)"
                    ></v-checkbox>
                  </td>
                  <td class="item-style">
                    <router-link :to="item.hash" class="project-title">{{ item.projectName }}</router-link>
                  </td>
                  <td class="item-style">
                    <v-chip :color="getColor(item.syntax)" dark>{{ getLangName(item.syntax) }}</v-chip>
                  </td>
                  <td class="item-style">{{ showTime(item.updateTime) }}</td>
                  <td class="item-style">{{ showTime(item.createTime) }}</td>
                  <td class="item-style">{{ `${domain}${item.hash}` }}</td>
                  <td class="item-style">
                    <v-icon
                      class="actions-icon"
                      color="white"
                      @click="
                        copyURL(index);
                        showShareBox();
                      "
                      >mdi-share</v-icon
                    >

                    <v-icon class="actions-icon" color="white" @click.stop="triggerDialog(item)"> mdi-delete </v-icon>
                    <v-dialog v-model="dialog" width="500" :retain-focus="false">
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          Are you sure to delete {{ selectedItem.projectName }}?
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="dialog = false"> No </v-btn>
                          <v-btn
                            text
                            @click="
                              dialog = false;
                              removeProject(selectedItem);
                            "
                          >
                            Yes
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-card v-if="sharebox" class="share-box" elevation="15">
            <v-icon color="white">mdi-share</v-icon>
            <a style="color: white; font-size: 20px">Link Copied! </a>
            <a style="font-size: 10px; color: gray">
              Use keyboard short cut Ctrl+V/ +V to paste on your favorite way to share link</a
            >
          </v-card>
        </div>
      </div>
    </v-col>
    <v-col cols="1">
      <IndexToolbar :userInfo="userInfo" />
    </v-col>
  </v-row>
</template>

<script>
import IndexToolbar from '../components/IndexToolbar.vue';
import WelcomeWindow from './WelcomeWindow.vue';
import { storage } from '../util';
import { REMOVE_PROJECT, UPDATE_PROJECT } from '../query';
import CODE_LANGUAGE_LIST from '../map';

export default {
  name: 'Projects',
  components: {
    IndexToolbar,
    WelcomeWindow,
  },
  props: { projects: Array },
  data() {
    return {
      headers: [
        { text: ' ', sortable: false, value: 'star', class: 'table-header' },
        { text: 'Title', align: 'start', sortable: false, value: 'title' },
        { text: 'Syntax', value: 'syntax' }, //  change sorting to dropdown
        { text: 'Modified', value: 'modified' },
        { text: 'Created', value: 'createdTime' },
        { text: 'URL', value: 'hash', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      sharebox: false,
      userInfo: {
        userName: '',
        userAvatar: '',
      },
      storage,
      selectedItem: '',
      userID: '',
      domain: window.location.href,
    };
  },
  created() {
    this.userID = storage.getUserInfo().userID;
  },
  methods: {
    triggerDialog(item) {
      this.selectedItem = item;
      this.dialog = true;
    },
    updateProject(listItemID, listItemTop) {
      this.$apollo
        .mutate({
          mutation: UPDATE_PROJECT,
          variables: {
            id: listItemID,
            isTop: listItemTop,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
    removeProject(item) {
      this.$apollo.mutate({
        mutation: REMOVE_PROJECT,
        variables: {
          /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
          id: item._id,
        },
      });
      const index = this.projects.indexOf(item);
      this.projects.splice(index, 1);
    },
    copyURL(listItemID) {
      const input = document.createElement('input');
      input.value = `${this.domain}${this.projects[listItemID].hash}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      console.log(this.projects);
    },
    getUserInfo(userName, userAvatar) {
      this.userInfo.userName = userName;
      this.userInfo.userAvatar = userAvatar;
    },
    showTime(date) {
      // change to moment later
      const inputDate = new Date(date);

      return inputDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
    },
    showShareBox() {
      this.sharebox = true;

      setTimeout(() => {
        this.sharebox = false;
      }, 2000);
    },
    reverse(topStatus) {
      return !topStatus;
    },
    getColor(syntax) {
      if (!syntax) {
        return null;
      }
      const object = CODE_LANGUAGE_LIST.filter((item) => item.langValue === syntax);
      return object[0].langColor;
    },
    getLangName(value) {
      const object = CODE_LANGUAGE_LIST.filter((item) => item.langValue === value);
      if (object.length < 1) {
        return 'error';
      }
      return object[0].langName;
    },
  },
};
</script>

<style scoped lang="scss">
.project-list-container {
  display: flex;
  margin: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #3d4b56;
}
.title {
  height: 10%;
  position: relative;
  color: white;
}
.title-text {
  position: absolute;
  bottom: 0;
  left: 100px;
  font-size: 30px;
}
.table-container {
  padding-top: 20px;
  padding-left: 100px;
  padding-right: 100px;
  color: white;
}
.project-list-table {
  width: 100%;
  border-radius: 10px;
}
.star-checkbox {
  left: 15px;
}
.table-header {
  //background-color: yellow;
  background-color: rgb(64, 78, 89);
  font-size: 20px;
  text-align: left;
  color: rgb(190, 198, 201);
}
td {
  height: 20px;
  border: solid 0px #000;
  border-style: none solid solid none;
  padding: 5px;
  border-top-style: solid;
}
td:first-child {
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  border-left-style: solid;
}
td:last-child {
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
}
.project-title {
  color: rgb(83, 124, 213);
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
}
.table-row {
  color: rgb(190, 198, 201);
}

.table-row:nth-child(odd) > .item-style {
  background-color: rgb(53, 66, 77);
}
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
.share-box {
  position: fixed;
  bottom: 40px;
  background-color: rgb(31, 41, 51);
  border-radius: 10px;
  width: 79%;
  height: 30px;
  text-align: center;
}
</style>
