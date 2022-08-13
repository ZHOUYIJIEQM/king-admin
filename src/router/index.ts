import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
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
        component: () => import('@/views/Hero/Hero.vue')
      },
      {
        path: 'hero/create',
        name: 'heroCreate',
        component: () => import('@/views/Hero/HeroEdit.vue')
      },
      {
        path: 'hero/edit/:id',
        name: 'heroEdit',
        component: () => import('@/views/Hero/HeroEdit.vue')
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/Article/Article.vue')
      },
      {
        path: 'article/create',
        name: 'articleCreate',
        component: () => import('@/views/Article/ArticleEdit.vue')
      },
      {
        path: 'article/edit/:id',
        name: 'articleEdit',
        component: () => import('@/views/Article/ArticleEdit.vue')
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
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  if (to.name !== 'login' && !sessionStorage.token) {
    return next({name: 'login'})
  }
  return next()
})
export default router