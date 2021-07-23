<template>
    <v-row style="height: 88vh" no-gutters>
      <v-col cols="11">
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
              :hide-default-footer="Projects.length < 7"
              :headers="headers"
              :items="Projects"
              :items-per-page="7"
              item-key="URL"
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
                  <tr v-for="(item, index) in items" :key="item.URL" class="table-row">
                    <td class="item-style">
                      <v-checkbox small v-model="item.star" class="star-checkbox"></v-checkbox>
                    </td>
                    <td class="item-style">
                      <router-link to="/001" class="project-title">{{ item.title }}</router-link>
                    </td>
                    <td class="item-style">
                      <v-chip :color="getColor(item.syntax)" dark>{{ item.syntax }}</v-chip>
                    </td>
                    <td class="item-style">{{ item.modified }}</td>
                    <td class="item-style">{{ item.createdTime }}</td>
                    <td class="item-style">{{ item.URL }}</td>
                    <td class="item-style">
                      <v-icon class="actions-icon" color="white" @click="copyURL(index)">mdi-share</v-icon>
                      <v-icon class="actions-icon" color="white" @click="deleteProject(index)">mdi-delete</v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
            <button v-if="Projects.length == 0" style="font-size: 200px" @click="addNewProject()">ADD PROJECT</button>
          </div>
      </div>
    </v-col>
    <v-col cols="1">
      <IndexToolbar />
    </v-col>
  </v-row>
</template>

<script>
import IndexToolbar from '../components/IndexToolbar.vue';

export default {
  name: 'Projects',
  components: {
    IndexToolbar,
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
      Projects: [
        {
          title: '进入editor',
          syntax: 'JS',
          modified: '5 mins ago',
          createdTime: '1 days ago',
          URL: 'http://cpg.url/abcde',
          star: true,
        },
      ],
    };
  },
  methods: {
    addNewProject() {
      // generating random number as url. temporary method
      const link = Math.floor(Math.random() * 9999);
      console.log(link);
      this.Projects.push({
        title: `Project ${this.Projects.length}`,
        syntax: 'SQL',
        modified: '1 second ago',
        createdTime: '1 seconds ago',
        URL: `http://cpg.url/${link}`,
        star: false,
      });
    },
    copyURL(ProjectID) {
      const input = document.createElement('input');
      input.value = this.Projects[ProjectID].URL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    },
    deleteProject(ProjectID) {
      this.Projects.splice(ProjectID, 1);
      console.log(this.Projects);
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
