import Vue from 'vue';
import VueRouter from 'vue-router';
import Editor from './views/Editor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/:roomId',
    name: 'Editor',
    component: Editor,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
