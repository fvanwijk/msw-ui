import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../components/Home.vue';
import MSWUI from 'msw-ui/src/MSW-UI.vue';
import { scenariosPerHandler } from '@/mocks';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/msw-ui',
    name: 'MSW UI',
    component: MSWUI,
    props: {
      scenariosPerHandler,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
