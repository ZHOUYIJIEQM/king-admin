import { createRouter, createWebHashHistory, RouteRecordRaw, } from "vue-router";

// 所有角色都可以访问的路由
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    component: () => import("@/views/Main.vue"),
    redirect: { name: "home" },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/Welcome.vue"),
        meta: { icon: "HomeFilled" },
      },
    ],
  },
  {
    path: "/goods",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "goods",
        component: () => import("@/views/Goods.vue"),
        meta: { icon: "Shop" },
      },
    ],
  },
  {
    path: "/category",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "category",
        component: () => import("@/views/Category.vue"),
        meta: { icon: "Grid" },
      },
    ],
  },
  {
    path: "/hero",
    name: "hero",
    component: () => import("@/views/Main.vue"),
    meta: { icon: "Management" },
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
    ],
  },
  {
    path: "/article",
    name: "article",
    component: () => import("@/views/Main.vue"),
    meta: { icon: "List" },
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
    path: "/inscription",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "inscription",
        component: () => import("@/views/Inscription.vue"),
        meta: { icon: "Postcard" },
      },
    ],
  },
  {
    path: "/summoner",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "summoner",
        component: () => import("@/views/Summoner.vue"),
        meta: { icon: "KnifeFork" },
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
        meta: { icon: "Ticket" },
      },
    ],
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
      },
    ],
  },
];

// 根据角色动态添加的路由
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "index",
        name: "user",
        component: () => import("@/views/User.vue"),
        meta: { 
          // 可以访问到该路由的角色列表
          roles: [ "admin" ], 
          icon: "UserFilled" 
        },
      },
    ],
  },
  // not found 要放到最后
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
    name: "NotFound",
    meta: { hidden: true },
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

export default router;
