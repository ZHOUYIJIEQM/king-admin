import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
// 这里不要用懒加载 () => import('路径'), 不然网速慢的时候, 点击菜单后不能直接跳转
import Login from '@/views/Login.vue';
import Main from '@/views/Main.vue';
import Welcome from '@/views/Welcome.vue';
import Category from '@/views/Category.vue';
import Goods from '@/views/Goods.vue';
import Hero from '@/views/Hero/Hero.vue';
import HeroEdit from '@/views/Hero/HeroEdit.vue';
import Article from '@/views/Article/Article.vue'
import ArticleEdit from '@/views/Article/ArticleEdit.vue'
import Advertise from '@/views/Advertise.vue';
import User from '@/views/User.vue';


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
    component: Main,
    redirect: {name: 'welcome'},
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'category',
        name: 'category',
        component: Category
      },
      {
        path: 'goods',
        name: 'goods',
        component: Goods
      },
      {
        path: 'hero',
        name: 'hero',
        component: Hero
      },
      {
        path: 'hero/create',
        name: 'heroCreate',
        component: HeroEdit
      },
      {
        path: 'hero/edit/:id',
        name: 'heroEdit',
        component: HeroEdit
      },
      {
        path: 'article',
        name: 'article',
        component: Article
      },
      {
        path: 'article/create',
        name: 'articleCreate',
        component: ArticleEdit
      },
      {
        path: 'article/edit/:id',
        name: 'articleEdit',
        component: ArticleEdit
      },
      {
        path: 'advertise',
        name: 'advertise',
        component: Advertise
      },
      {
        path: 'user',
        name: 'user',
        component: User
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