import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/reset.scss'
import api from '@/api/index'
import { createPinia } from "pinia";

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(api)
app.use(pinia)
app.mount('#app')

