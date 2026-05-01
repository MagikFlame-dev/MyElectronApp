import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router.js';

createApp(App)
    .use(router)
    .mount('#app')