import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  NProgress.start()
  // 不是去登录页, 也没有 token, 跳到登录页
  if (to.name !== 'login' && !sessionStorage.token) {
    return next({name: 'login'})
  }
  // 已经有token表示已登录, 还要去登录页就跳到欢迎页面
  if (sessionStorage.token && to.name === "login") {
    return next({name: "welcome"})
  }
  return next()
})

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done()
})

export default router