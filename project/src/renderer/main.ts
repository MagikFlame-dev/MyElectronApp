import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/scripts/router.js';
import { pinia } from '@renderer/scripts/stores.js';

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')