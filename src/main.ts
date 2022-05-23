import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/reset.scss'
import request from '@/api/request'

const app = createApp(App)
app.use(router)
app.use(request)
app.mount('#app')
