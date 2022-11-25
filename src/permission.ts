import Cookies from 'js-cookie'
import router from "@/router/index";
import { RouteLocationNormalized } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from 'element-plus'
import { permissionStore } from '@/store/permission';
import { commonStore } from "@/store";

// 路由名 白名单
const whiteList = ['login', '404']

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  NProgress.start();
  
  // 登录过期
  if (Cookies.get("loginTime") && (Date.now() - Number(Cookies.get("loginTime")) > commonStore().expiredTime)) {
    ElMessage({ message: '登录已过期!', type: 'warning', duration: 3000 })
    Cookies.remove("loginTime");
    return next(`/login?redirect=${to.path}`)
  }

  const token = Cookies.get('token')
  // 有 token 表示已登录
  if (token) {
    // 登录后不要再前往登录页, 跳转到其他页面
    if (to.path === '/login') {
      // 如果存在重定向字符串
      let path = to.query.redirect || '/'
      return next({ path })
    } else {
      // 有用户角色, 表示路由已配置好
      if (permissionStore().userRoles.length) {
        return next()
      } else {
        // 生成路由及菜单
        permissionStore().setAsyncRoutes()
        return next({ ...to, replace: true })
      }
    }
  } else {
    // 在白名单就直接进入
    if (whiteList.includes(String(to.name))) {
      return next()
    } else {
      // 不在白名单就跳到登录页并记录前往的路由路径
      return next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
});
