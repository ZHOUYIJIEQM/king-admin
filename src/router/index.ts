import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { permissionStore } from '@/store/permission';

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/Main.vue"),
    redirect: { name: "welcome" },
    children: [
      {
        path: "welcome",
        name: "welcome",
        component: () => import("@/views/Welcome.vue"),
      },
      {
        path: "category",
        name: "category",
        component: () => import("@/views/Category.vue"),
      },
      {
        path: "goods",
        name: "goods",
        component: () => import("@/views/Goods.vue"),
      },
      {
        path: "hero",
        name: "hero",
        component: () => import("@/views/Hero/Hero.vue"),
      },
      {
        path: "hero/create",
        name: "heroCreate",
        component: () => import("@/views/Hero/HeroEdit.vue"),
      },
      {
        path: "hero/edit/:id",
        name: "heroEdit",
        component: () => import("@/views/Hero/HeroEdit.vue"),
      },
      {
        path: "article",
        name: "article",
        component: () => import("@/views/Article/Article.vue"),
      },
      {
        path: "article/create",
        name: "articleCreate",
        component: () => import("@/views/Article/ArticleEdit.vue"),
      },
      {
        path: "article/edit/:id",
        name: "articleEdit",
        component: () => import("@/views/Article/ArticleEdit.vue"),
      },
      {
        path: "advertise",
        name: "advertise",
        component: () => import("@/views/Advertise.vue"),
      },
      {
        path: "404",
        name: "404",
        component: () => import("@/views/404.vue"),
        meta: {
          hidden: true
        }
      },
    ],
  },
];

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "user",
    name: "user",
    component: () => import("@/views/User.vue"),
    meta: { roles: ["admin"], parentRoute: 'main', },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
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
    // // 不是去登录页, 也没有 token, 跳到登录页
    // if (to.name !== "login" && !sessionStorage.token) {
    //   return next({ name: "login" });
    // }
    // // 已经有token表示已登录, 还要去登录页就跳到欢迎页面
    // if (sessionStorage.token && to.name === "login") {
    //   return next({ name: "welcome" });
    // }
    // return next();

    const token = sessionStorage.token
    // 已登录
    if (token) {
      if (to.name === 'login') {
        // 去登录页, 直接跳到首页
        next({ name: 'welcome' })
      } else {
        if (!permissionStore().roles?.length) {
          permissionStore().setUserInfo()
          let routes = permissionStore().getAsyncRoutes(permissionStore().roles)
          routes.forEach(route => {
            console.log('-=-', route);
            if (route.meta?.parentRoute) {
              router.addRoute(route.meta.parentRoute, route)
            } else {
              router.addRoute(route)
            }
          })
          console.log('-=-=-', router.getRoutes());
          // console.log(router.options.routes);
          let menuList: any = []
          router.options.routes.forEach(item => {
            if(item.path === '/') {
              item.children?.map(child => {
                // console.log(child.name);
                if (["hero", "article"].includes(child.name as string)) {
                  // console.log(child);
                } else if (child.path.split('/').length <= 1 && !child.meta?.hidden) {
                  menuList.push({
                    menu: child.name,
                    index: `/${child.path}`,
                    // icon: markRaw()
                  })
                }
              })
            }
          })
          // console.log(menuList);
          next({ ...to, replace: true })
          // console.log(router);
        } else {
          next()
        }
      }
    } else {
      // 未登录
      // 在白名单, 直接进入
      if (whiteList.includes(String(to.name))) {
        next()
      } else {
        // 否则全部重定向到登录页, 记录路由名
        next(`/login?redirect=${String(to.name)}`)
      }
    }
  }
);

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
  console.log(router.options);
});


export default router