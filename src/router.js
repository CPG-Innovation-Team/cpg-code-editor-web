import Vue from 'vue';
import VueRouter from 'vue-router';
import Projects from './views/Projects.vue';
import Editor from './views/Editor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/:projectId',
    name: 'Editor',
    component: Editor,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
