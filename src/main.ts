import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/reset.scss'
import api from '@/api/index'
import { createPinia } from "pinia";
// todo: 后面记得取消掉 import request from '@/api/request'
import request from '@/api/request'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(api)
app.use(pinia)
// todo: 后面记得取消掉
app.use(request)
app.mount('#app')

