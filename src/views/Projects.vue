<template>
  <div class="project-list-container">
    <div class="title">
      <div class="title-text">Code Projects</div>
      <button
        style="
          position: absolute;
          right: 130px;
          bottom: 0;
          height: 30px;
          width: 480px;
          background-color: white;
          color: black;
        "
        @click="addNewProject()"
      >
        点击上方Create进入Editor，点击这里手动添加list行
      </button>
    </div>
    <div class="table-container">
      <v-data-table class="project-list-table">
        <tr class="table-top-line">
          <th>TITLE</th>
          <th>SYNTAX</th>
          <th>MODIFIED</th>
          <th>CREATED</th>
          <th>URL</th>
          <th>ACTIONS</th>
        </tr>
        <tr v-show="Projects.length != 0" v-for="(element, index) in Projects" v-bind:key="element.URL">
          <th>{{ element.title }}</th>
          <th>{{ element.syntax }}</th>
          <th>{{ element.modified }}</th>
          <th>{{ element.createdTime }}</th>
          <th>{{ element.URL }}</th>
          <th><button @click="copyURL(index)">share</button> <button @click="deleteProject(index)">delete</button></th>
        </tr>
      </v-data-table>
      <button v-show="Projects.length == 0" style="font-size: 200px" @click="addNewProject()">ADD PROJECT</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  data: () => ({
    Projects: [
      {
        title: `Project name 0`,
        syntax: 'java',
        modified: '5 mins ago',
        createdTime: '2 days ago',
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
button {
  background-color: lightblue;
}
.project-list-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
