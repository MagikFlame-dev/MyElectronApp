import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router.js';
import pinia from '@renderer/pinia.js';
import InputValidatorDirective from './directives/InputValidator/directive.js';

const app = createApp(App)
.use(router)
.use(pinia)

app.directive('validateInput', InputValidatorDirective)

app.mount('#app')