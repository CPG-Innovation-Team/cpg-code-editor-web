<template>
  <div>
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
              :headers="headers"
              :items="Projects"
              class="project-list-table"
              :items-per-page="8"
              item-key="URL"
            >
              <template v-slot:item.title="{ item }">
                <router-link to="/001">{{ item.title }}</router-link>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <v-icon small class="mr-2" @click="copyURL(index)">mdi-share</v-icon>
                <v-icon small class="mr-2" @click="deleteProject(index)">mdi-delete</v-icon>
              </template>
            </v-data-table>
            <button v-show="Projects.length == 0" style="font-size: 200px" @click="addNewProject()">ADD PROJECT</button>
          </div>
        </div>
      </v-col>
      <v-col cols="1">
        <Toolbar />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Toolbar from '../components/Toolbar.vue';

export default {
  name: 'Projects',
  components: {
    Toolbar,
  },
  data: () => ({
    headers: [
      { text: 'Title', align: 'start', sortable: false, value: 'title' },
      { text: 'Syntax', value: 'syntax' }, //  change sorting to dropdown
      { text: 'Modified', value: 'modified' },
      { text: 'Created', value: 'createdTime' },
      { text: 'URL', value: 'URL', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    Projects: [
      {
        title: `项目名称(点击我进入editor)`,
        syntax: 'java',
        modified: '5 mins ago',
        createdTime: '1 days ago',
        URL: 'http://cpg.url/abcde',
      },
    ],
  }),
  methods: {
    addNewProject() {
      // generating random number as url. temporary method
      const link = Math.floor(Math.random() * 9999);
      console.log(link);
      this.Projects.push({
        title: `Project name ${this.Projects.length}`,
        syntax: 'java',
        modified: '1 second ago',
        createdTime: '1 seconds ago',
        URL: `http://cpg.url/${link}`,
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
  padding-top: 30px;
  padding-left: 100px;
  padding-right: 100px;
  color: white;
}
.project-list-table {
  width: 100%;
}
.table-top-line {
  background-color: #e4e4e410;
}
</style>
