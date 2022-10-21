import { defineStore } from "pinia";
import { asyncRoutes } from "@/router/index";
import { markRaw } from "vue";
import { List, Menu, Grid, Management, Ticket, UserFilled, } from "@element-plus/icons-vue";

// route.meta.roles表示可以访问该路由的角色
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  // 没有配置的默认可以访问
  return true
}

// 根据角色生成路由
function GenerateRoutes(routes: any, roles: any) {
  let res: any[] = []
  routes.forEach(route => {
    const temp = {...route}
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = GenerateRoutes(temp.children, roles)
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
      // 用户权限级别
      userLevel: '',
      // 用户权限
      roles: [],
      // 左侧菜单
      menuList: [
        {
          menu: '分类列表',
          index: '/category',
          icon: markRaw(Grid),
        },
        {
          menu: '物品列表',
          index: '/goods',
          icon: markRaw(Menu),
        },
        {
          menu: '英雄管理',
          icon: markRaw(Management),
          index: '3',
          menuItem: [
            {
              name: '英雄列表',
              index: '/hero',
            },
          ]
        },
        {
          menu: '文章管理',
          icon: markRaw(List),
          index: '4',
          menuItem: [
            {
              name: '文章列表',
              index: '/article',
            },
          ]
        },
        {
          menu: '广告列表',
          index: '/advertise',
          icon: markRaw(Ticket),
        },
      ]
    }
  },
  getters: {
    getAuth() {
      if (this.userLevel && Number(this.userLevel) === 1) {
        return '管理员'
      } 
      return '普通用户'
    }
  },
  actions: {
    setMenuList(val: any) {
      this.menuList = val;
    },
    setUserInfo() {
      this.userLevel = sessionStorage.userLevel
      this.userName = sessionStorage.userName
      this.roles = sessionStorage.roles ? JSON.parse(sessionStorage.roles) : []
      if (this.userLevel === '1') {
        this.menuList.push({
          menu: '用户列表',
          index: '/user',
          icon: markRaw(UserFilled),
        })
      }
    },
    getAsyncRoutes(roles) {
      let filterRoutes = GenerateRoutes(asyncRoutes, roles);
      return filterRoutes
    }
  },
});
