import { createRouter, createWebHashHistory, RouteRecordRaw, RouteLocationNormalized, } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { permissionStore } from '@/store/permission';

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { hidden: true }
  },
  {
    path: "/",
    component: () => import("@/views/Main.vue"),
    redirect: { name: "welcome" },
    meta: { hidden: true },
    children: [
      {
        path: "welcome",
        name: "welcome",
        component: () => import("@/views/Welcome.vue"),
      }
    ]
  },
  {
    path: "/category",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "category",
        component: () => import("@/views/Category.vue"),
        meta: { icon: 'Grid' }
      }
    ]
  },
  {
    path: "/goods",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "goods",
        component: () => import("@/views/Goods.vue"),
        meta: { icon: 'Menu' }
      }
    ]
  },
  {
    path: "/hero",
    name: "hero",
    component: () => import("@/views/Main.vue"),
    meta: { icon: 'Management' },
    children: [
      {
        path: "list",
        name: "heroList",
        component: () => import("@/views/Hero/Hero.vue"),
      },
      {
        path: "edit/:id",
        name: "heroEdit",
        component: () => import("@/views/Hero/HeroEdit.vue"),
      },
      {
        path: "create",
        name: "heroCreate",
        component: () => import("@/views/Hero/HeroEdit.vue"),
      },
    ]
  },
  {
    path: "/article",
    name: "article",
    component: () => import("@/views/Main.vue"),
    meta: { icon: 'List' },
    children: [
      {
        path: "list",
        name: "articleList",
        component: () => import("@/views/Article/Article.vue"),
      },
      {
        path: "edit/:id",
        name: "articleEdit",
        component: () => import("@/views/Article/ArticleEdit.vue"),
      },
      {
        path: "create",
        name: "articleCreate",
        component: () => import("@/views/Article/ArticleEdit.vue"),
      },
    ],
  },
  {
    path: "/advertise",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "advertise",
        component: () => import("@/views/Advertise.vue"),
        meta: { icon: 'Ticket' }
      }
    ]
  },
  {
    path: "/error",
    component: () => import("@/views/Main.vue"),
    meta: { hidden: true },
    children: [
      {
        path: "404",
        name: "404",
        component: () => import("@/views/404.vue"),
      }
    ]
  }
];

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "user",
        component: () => import("@/views/User.vue"),
        meta: { roles: ["admin"], parentRoute: 'main', icon: 'UserFilled' },
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
    name: 'NotFound',
    meta: { hidden: true }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 白名单
const whiteList = ['login', '404']

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    NProgress.start();

    const token = sessionStorage.token
    // 有token表示已登录
    if (token) {
      if (to.name === 'login') {
        // 去登录页, 看有没有重定向路由名, 有就前往, 没有直接跳到首页
        if (to.query.redirect) {
          next({ name: to.query.redirect })
        } else {
          next({ name: 'welcome' })
        }
      } else {
        // 如果pinia保存了用户角色,说明已经生成好了菜单, 可以直接进入目标路由页, 没有就要设置用户角色, 生成路由及菜单
        if (permissionStore().roles?.length) {
          next()
        } else {
          // 设置用户信息
          permissionStore().setUserInfo()
          // 生成路由及菜单
          permissionStore().setAsyncRoutes()
          next({ ...to, replace: true })
        }
      }
    } else {
      // 未登录
      // 在白名单, 直接进入, 不是就跳转登录页并标记跳转前路由名
      if (whiteList.includes(String(to.name))) {
        next()
      } else {
        next(`/login?redirect=${String(to.name)}`)
      }
    }
  }
);

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
});

export default router