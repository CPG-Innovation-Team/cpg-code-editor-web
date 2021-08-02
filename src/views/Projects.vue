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
            :hide-default-footer="project.length < 7"
            :headers="headers"
            :items="project"
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
                    ></v-checkbox>
                  </td>
                  <td class="item-style">
                    <router-link to="/001" class="project-title">{{ item.projectName }}</router-link>
                  </td>
                  <td class="item-style">
                    <v-chip :color="getColor(item.syntax)" dark>{{ item.syntax }}</v-chip>
                  </td>
                  <td class="item-style">{{ showTime(item.updateTime) }}</td>
                  <td class="item-style">{{ showTime(item.createTime) }}</td>
                  <td class="item-style">http://cpg.url/{{ item.hash }}</td>
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
                    <!-- <v-icon class="actions-icon" color="white" @click="removeProject(item._id)"> mdi-delete</v-icon> -->
                    <v-icon class="actions-icon" color="white" @click.stop="triggerDialog(item.projectName, item._id)"
                      >mdi-delete</v-icon
                    >
                    <v-dialog v-model="dialog" width="500" :retain-focus="false">
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          Are you sure to delete {{ itemName }}?
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="dialog = false"> No </v-btn>
                          <v-btn
                            text
                            @click="
                              dialog = false;
                              removeProject(itemID);
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
import { GET_PROJECT, REMOVE_PROJECT } from '../query';

export default {
  name: 'Projects',
  components: {
    IndexToolbar,
    WelcomeWindow,
  },
  apollo: {
    project: GET_PROJECT,
  },
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
      project: [],
      dialog: false,
      sharebox: false,
      userInfo: {
        userName: '',
        userAvatar: '',
      },
      storage,
      itemName: '',
      itemID: '',
      userID: '',
    };
  },
  created() {
    this.userID = storage.getUserInfo().userID;
  },
  updated() {
    console.log(this.project);
  },
  methods: {
    triggerDialog(listItemName, listItemID) {
      this.dialog = true;
      this.itemName = listItemName;
      this.itemID = listItemID;
    },
    removeProject(listItemID) {
      this.$apollo
        .mutate({
          mutation: REMOVE_PROJECT,
          variables: {
            id: listItemID,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
    copyURL(listItemID) {
      const input = document.createElement('input');
      input.value = 'http://cpg.url/';
      input.value += this.project[listItemID].hash;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    },
    getUserInfo(userName, userAvatar) {
      this.userInfo.userName = userName;
      this.userInfo.userAvatar = userAvatar;
    },
    getColor(syntax) {
      if (syntax === 'JS') {
        return 'yellow';
      }
      if (syntax === 'SQL') {
        return 'green';
      }
      return 'blue';
    },
    showTime(date) {
      // change to moment later
      const inputDate = new Date(date);
      // const currentTime = new Date();

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
}
td:first-child {
  border-top-left-radius: 7px;
}
td:last-child {
  border-top-right-radius: 7px;
}
td:first-child {
  border-bottom-left-radius: 7px;
}
td:last-child {
  border-bottom-right-radius: 7px;
}
td {
  border-top-style: solid;
}
td:first-child {
  border-left-style: solid;
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
.table-row:nth-child(even) > .item-style {
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
