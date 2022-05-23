import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      noRequiredAuth: true
    },
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: {name: 'welcome'},
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/Welcome.vue')
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/Category.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/Goods.vue')
      },
      {
        path: 'hero',
        name: 'hero',
        component: () => import('@/views/Hero.vue')
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/Article.vue')
      },
      {
        path: 'advertise',
        name: 'advertise',
        component: () => import('@/views/Advertise.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User.vue')
      },
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router