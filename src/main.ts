import { createApp } from 'vue';
import App from './App.vue';
import { scenarios, scenariosPerHandler } from './mocks';
import router from './router';

if (process.env.NODE_ENV === 'development') {
  Promise.all([import('./msw-init'), import('./msw-ui')]).then(([msw, mswui]) => {
    mswui.register(msw.default, scenarios, scenariosPerHandler);
    msw.default.start({ onUnhandledRequest: 'bypass' });
    createApp(App).use(router).mount('#app');
  });
} else {
  createApp(App).use(router).mount('#app');
}
