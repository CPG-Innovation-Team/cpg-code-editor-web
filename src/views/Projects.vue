<template>
  <v-row style="height: 88vh" no-gutters>
    <v-col cols="11">
      <WelcomeWindow v-if="!userID" :userInfo="userInfo" @passUserInfo="getUserInfo" />
      <div class="project-list-container">
        <div class="title">
          <div class="title-text">Code Projects</div>
          <button
            style="
              position: absolute;
              right: 130px;
              bottom: 0;
              height: 30px;
              width: 280px;
              background-color: white;
              color: black;
            "
            @click="addNewProject()"
          >
            点击这里手动添加list行
          </button>
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
                <tr v-for="(item, index) in items" :key="index" class="table-row">
                  <td class="item-style">
                    <v-checkbox small class="star-checkbox"></v-checkbox>
                  </td>
                  <td class="item-style">
                    <router-link to="/001" class="project-title">{{ item.projectName }}</router-link>
                  </td>
                  <td class="item-style">
                    <v-chip :color="getColor(item.syntax)" dark>{{ item.syntax }}</v-chip>
                  </td>
                  <td class="item-style">{{ item.updateTime }}</td>
                  <td class="item-style">{{ item.createTime }}</td>
                  <td class="item-style">{{ item._id }}</td>
                  <td class="item-style">
                    <v-icon class="actions-icon" color="white" @click="copyURL(index)">mdi-share</v-icon>

                    <v-dialog v-model="dialog" width="500" :retain-focus="false">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="actions-icon" color="white" v-bind="attrs" v-on="on">mdi-delete</v-icon>
                      </template>

                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          Are you sure to delete {{ item.projectName }}?
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="dialog = false"> No </v-btn>
                          <v-btn
                            text
                            @click="
                              dialog = false;
                              removeProject(item._id);
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
import { GET_PROJECT } from '../query';

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
        { text: 'URL', value: 'URL', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      project: [],
      dialog: false,
      userInfo: {
        userName: '',
        userAvatar: '',
      },
      storage,
      userID: '',
    };
  },
  created() {
    this.userID = storage.getUserInfo().userID;
  },
  methods: {
    removeProject(id) {
      console.log(id);
    },
    copyURL(ProjectID) {
      const input = document.createElement('input');
      input.value = this.Projects[ProjectID].URL;
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
  font-size: 15px;
  font-weight: 600;
}
.table-row {
  color: rgb(190, 198, 201);
}
.table-row:nth-child(even) > .item-style {
}
.table-row:nth-child(odd) > .item-style {
  height: 70px;
  background-color: rgb(53, 66, 77);
}
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
