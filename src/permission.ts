import Cookies from 'js-cookie'
import router from "@/router/index";
import { RouteLocationNormalized } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from 'element-plus'
import { permissionStore } from '@/store/permission';
import { commonStore } from "./store";

// 路由名 白名单
const whiteList = ['login', '404']

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  NProgress.start();
  const token = Cookies.get('token')
  // 根据上次登录的时间判断是否会话是否已过期
  if (Cookies.get("loginTime") && Date.now() - Number(Cookies.get("loginTime")) > commonStore().expiredTime) {
    ElMessage({ message: '会话已过期!', type: 'warning', duration: 3000 })
    Cookies.remove("loginTime");
    return next(`/login?redirect=${String(to.name)}`)
  }
  // 有token表示已登录
  if (token) {
    if (to.name === 'login') {
      // 已登录未退出, 不能进入登录页, 看有无重定向路由名, 有就前往, 没有直接跳到首页
      if (to.query.redirect) {
        next({ name: to.query.redirect })
      } else {
        next({ name: 'welcome' })
      }
    } else {
      // 如果pinia保存了用户角色,说明已经生成好了菜单, 可以直接进入目标路由页, 没有就要设置用户角色, 生成路由及菜单
      if (permissionStore().userRole) {
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
      if (to.name) {
        next(`/login?redirect=${String(to.name)}`)
      } else {
        next({ name: 'login', replace: true })
      }
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
});
