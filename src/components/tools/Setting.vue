<template>
  <div outlined class="white--text container">
    <h4 class="mb-5">Editor Setting</h4>
    <div>
      <div>
        <h5>Title</h5>
        <v-text-field
          label="Project name"
          background-color="primary lighten-1"
          color="blueBtn"
          dense
          single-line
          outlined
          dark
        ></v-text-field>
      </div>

      <div>
        <h5>Syntax</h5>
        <v-select
          v-model="selectedLanguage"
          :items="codeLanguageList"
          item-text="langName"
          item-value="langValue"
          dark
          outlined
          dense
          return-object
          color="blueBtn"
          background-color="primary lighten-1"
          item-color="blueBtn"
          :menu-props="{ bottom: true, offsetY: true }"
          @change="$emit('changeLanguage', `${selectedLanguage.langValue}`)"
        ></v-select>
      </div>

      <div>
        <h5>Tab Size</h5>
        <v-select
          :items="tabSize"
          dark
          outlined
          dense
          color="blueBtn"
          background-color="primary lighten-1"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
      </div>
    </div>
  </div>
</template>

<script>
import CODE_LANGUAGE_LIST from '../../map';

export default {
  name: 'Setting',
  data() {
    return {
      selectedLanguage: '',
      codeLanguageList: CODE_LANGUAGE_LIST,
      tabSize: [2, 4, 6],
    };
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
</style>
