import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: {
          base: '#24303C', // header
          lighten2: '#3D4B56', // left sidebar
          lighten1: '#2C333B', // middle coding part
          darlen1: '#1F2933', // right toolbar section
          darken2: '#161E27', // right pop up section of tools
        },
        // for buttons
        blueBtn: '#537CD6',
        greyBtn: '#737D81',
        text: {
          base: '#BEC6C9',
          darken1: '#737D81',
        },
        // colors for and avatars in the header
        cyan: '#1BBED2', // 青色
        green: '#7FBA7A',
        orange: '#FF754C',
      },
    },
  },
});
