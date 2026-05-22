import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router.js';
import pinia from '@renderer/pinia.js';

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')