import { defineStore } from "pinia";
import Cookies from 'js-cookie'
import { markRaw } from "vue";
import {HomeFilled, Shop, Postcard, KnifeFork, List, Grid, Management, Ticket, UserFilled, } from "@element-plus/icons-vue";
import * as allRoutes from "@/router/index"

/**
 * 判断用户角色是否能访问该路由
 * @param { string } userRole 用户的角色
 * @param route 路由
 */
function hasPermission(userRole: string, route) {
  if (route.meta?.roles) {
    return route.meta.roles.includes(userRole)
  }
  // 没有配置 route.meta.roles 默认可以访问
  return true
}

/**
 * 根据角色生成路由
 */
function generateRoutes(routes: any, userRole: string) {
  let res: any[] = []
  routes.forEach(route => {
    const temp = { ...route }
    if (hasPermission(userRole, temp)) {
      if (temp.children) {
        temp.children = generateRoutes(temp.children, userRole)
      }
      res.push(temp)
    }
  })
  return res
}

export const permissionStore = defineStore("permission", {
  state: () => {
    return {
      // 用户名
      userName: '',
      // 用户角色
      userRole: '',
      // 左侧菜单
      permissionMenu: []
    }
  },
  getters: {
    getAuth() {
      if (this.userRole === 'admin') {
        return '管理员'
      } 
      return '普通用户'
    }
  },
  actions: {
    /**
     * 设置权限级别, 用户名, 用户角色
     */
    setUserInfo() {
      this.userName = Cookies.get("userName")
      this.userRole = Cookies.get("userRole")
    },
    /**
     * 根据用户角色提取出路由
     * @param userRole 用户角色
     */
    getAsyncRoutes(userRole) {
      let filterRoutes = generateRoutes(allRoutes.asyncRoutes, userRole);
      return filterRoutes
    },
    /**
     * 设置路由
     */
    setAsyncRoutes() {
      // 根据用户的角色提取动态路由
      let filterRoutes = generateRoutes(allRoutes.asyncRoutes, this.userRole)
      filterRoutes.forEach(route => {
        allRoutes.default.addRoute(route)
      })
      // 所有符合的路由, 用这个(结合实际要求)生成菜单
      let accessRoutes = allRoutes.routes.concat(filterRoutes)
      let menuList: any = []
      // 对应的 element-plus 图标
      let iconMap = {
        'HomeFilled': markRaw(HomeFilled),
        'Shop': markRaw(Shop),
        'Grid': markRaw(Grid),
        'Ticket': markRaw(Ticket),
        'UserFilled': markRaw(UserFilled),
        'List': markRaw(List),
        'Management': markRaw(Management),
        'KnifeFork': markRaw(KnifeFork),
        'Postcard': markRaw(Postcard),
      }
      accessRoutes.forEach(route => {
        // hidden: true 跳过不处理
        if (!route.meta?.hidden) {
          if (route.children?.length) {
            if (route.children.length > 1) {
              menuList.push({
                menu: route?.name,
                icon: iconMap[route.meta?.icon as string],
                children: [
                  { menu: route.children[0].name, }
                ]
              })
            } else {
              menuList.push({
                // menu 既是路由名, 也作为 i18n 的标记
                menu: route.children[0]?.name,
                icon: iconMap[route.children[0]?.meta?.icon as string],
              })
            }
          }
        } 
      })
      this.permissionMenu = menuList
    }
  },
});
