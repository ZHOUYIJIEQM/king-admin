import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/reset.scss'
import api from '@/api/index'
// todo: 后面记得取消掉 import request from '@/api/request'
import request from '@/api/request'

const app = createApp(App)
app.use(router)
app.use(api)
// todo: 后面记得取消掉
app.use(request)
app.mount('#app')

