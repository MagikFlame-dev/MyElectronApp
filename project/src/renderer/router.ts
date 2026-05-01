import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@renderer/App.vue'

export const routes = [
  { path: '/', label: 'Main', component: App },
  { path: '/:pathMatch(.*)*', name: 'Error', component: Error },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
