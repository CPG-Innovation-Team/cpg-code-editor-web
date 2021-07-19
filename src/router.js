import Vue from 'vue';
import VueRouter from 'vue-router';
import Editor from './views/Editor.vue';
import ProjectList from './views/ProjectList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/:roomId',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/ProjectList',
    name: 'ProjectList',
    component: ProjectList,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
