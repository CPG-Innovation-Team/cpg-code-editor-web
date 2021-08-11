<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="white--text">正大集团</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="white--text ml-2" color="blueBtn" v-bind="attrs" v-on="on">
          <v-icon>mdi-plus-box</v-icon>Create</v-btn
        >
      </template>

      <v-card @keyup.enter="validate()">
        <v-card-title class="headline grey lighten-2">Create Project</v-card-title>

        <v-form v-model="valid" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="projectName" label="Project name" :rules="nameRules" required></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="projectSyntax"
                  :items="codeLanguageList"
                  label="Project syntax"
                  item-text="langName"
                  :rules="syntaxRules"
                ></v-select>
                <!-- <v-text-field v-model="projectSyntax" label="Project syntax" :rules="nameRules" required></v-text-field> -->
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              dialog = false;
              resetForm();
            "
            >Cancel</v-btn
          >
          <v-btn text @click="validate()"> Create </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import CODE_LANGUAGE_LIST from '../map';
import { storage } from '../util';
import { CREATE_PROJECT } from '../query';

export default {
  name: 'IndexHeader',
  props: ['projects'],
  data() {
    return {
      valid: false,
      projectName: '',
      nameRules: [(v) => !!v || 'Name is required'],
      syntaxRules: [(v) => !!v || 'Syntax is required'],
      projectSyntax: '',
      dialog: false,
      codeLanguageList: CODE_LANGUAGE_LIST,
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (!!this.projectName && !!this.projectSyntax) {
        this.createProject();
        this.dialog = false;
        this.resetForm();
      }
    },
    resetForm() {
      this.projectName = '';
      this.projectSyntax = '';
      this.$refs.form.reset();
    },
    createProject() {
      this.$apollo
        .mutate({
          mutation: CREATE_PROJECT,
          variables: {
            projectName: this.projectName,
            syntax: this.projectSyntax,
            userId: storage.getUserInfo().userID,
          },
        })
        .then((res) => {
          this.projects.push(res.data.createProject.data[0]);
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
