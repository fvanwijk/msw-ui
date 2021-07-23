import { createApp } from 'vue';
import App from './App.vue';
import { scenarios } from './mocks';
import router from './router';

if (process.env.NODE_ENV === 'development') {
  import('./msw-init').then(msw => {
    msw.registerScenarios(scenarios);
    msw.default.start({ onUnhandledRequest: 'bypass' });
    createApp(App).use(router).mount('#app');
  });
} else {
  createApp(App).use(router).mount('#app');
}
