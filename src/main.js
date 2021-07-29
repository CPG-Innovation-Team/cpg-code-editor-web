import Vue from 'vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';

Vue.config.productionTip = false;

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: 'http://localhost:3000/api',
  }),
});

Vue.use(VueApollo);

new Vue({
  router,
  vuetify,
  apolloProvider,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
