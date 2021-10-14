import Vue from 'vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import VueSanitize from 'vue-sanitize';
import Rollbar from 'rollbar';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';

Vue.config.productionTip = false;

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: process.env.VUE_APP_API_URL,
  }),
});

Vue.prototype.$rollbar = new Rollbar({
  accessToken: process.env.VUE_APP_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

Vue.config.errorHandler = (err, vm) => {
  vm.$rollbar.error(err);
  throw err;
};

Vue.use(VueApollo);
Vue.use(VueSanitize);

new Vue({
  router,
  vuetify,
  apolloProvider,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
