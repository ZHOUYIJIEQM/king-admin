import { defineStore } from "pinia";
// import { asyncRoutes } from "@/router/index";
import { markRaw } from "vue";
import { List, Menu, Grid, Management, Ticket, UserFilled, } from "@element-plus/icons-vue";
import * as allRoutes from "@/router/index"

/**
 * route.meta.roles表示可以访问该路由的角色
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  // 没有配置的默认可以访问
  return true
}

/**
 * 根据角色生成路由
 */
function generateRoutes(routes: any, roles: any) {
  let res: any[] = []
  routes.forEach(route => {
    const temp = {...route}
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = generateRoutes(temp.children, roles)
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
      routes: [],
      // 左侧菜单
      menuList: [
        {
          menu: 'category',
          i18n: "menu.category",
          index: '/category',
          icon: markRaw(Grid),
        },
        {
          menu: 'goods',
          i18n: "menu.goods",
          index: '/goods',
          icon: markRaw(Menu),
        },
        {
          menu: 'hero',
          i18n: "menu.hero",
          icon: markRaw(Management),
          index: '3',
          menuItem: [
            {
              name: '英雄列表',
              index: '/hero',
              menu: 'heroList',
              i18n: "menu.heroList",
            },
          ]
        },
        {
          menu: 'article',
          i18n: "menu.article",
          icon: markRaw(List),
          index: '4',
          menuItem: [
            {
              name: '文章列表',
              index: '/article',
              menu: 'articleList',
              i18n: "menu.articleList",
            },
          ]
        },
        {
          menu: 'advertise',
          i18n: "menu.advertise",
          index: '/advertise',
          icon: markRaw(Ticket),
        },
      ],
      permissionMenu: []
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
    /**
     * 设置权限级别, 用户名, 用户角色
     */
    setUserInfo() {
      this.userLevel = sessionStorage.userLevel
      this.userName = sessionStorage.userName
      this.roles = sessionStorage.roles ? JSON.parse(sessionStorage.roles) : []
      // if (this.userLevel === '1') {
      //   this.menuList.push({
      //     menu: '用户列表',
      //     i18n: 'menu.user',
      //     index: '/user',
      //     icon: markRaw(UserFilled),
      //   })
      // }
    },
    /**
     * 根据用户角色提取出路由
     * @param roles 用户角色
     */
    getAsyncRoutes(roles) {
      let filterRoutes = generateRoutes(allRoutes.asyncRoutes, roles);
      console.log('异步', filterRoutes);
      return filterRoutes
    },
    /**
     * 设置路由
     */
    setAsyncRoutes() {
      // 根据用户的角色提取动态路由
      let filterRoutes = generateRoutes(allRoutes.asyncRoutes, this.roles)
      filterRoutes.forEach(route => {
        allRoutes.default.addRoute(route)
      })
      // 所有符合的路由, 用这个(结合实际要求)生成菜单
      let accessRoutes = allRoutes.routes.concat(filterRoutes)
      let menuList: any = []
      let iconMap = {
        'Grid': markRaw(Grid),
        'Menu': markRaw(Menu),
        'Ticket': markRaw(Ticket),
        'UserFilled': markRaw(UserFilled),
        'List': markRaw(List),
        'Management': markRaw(Management),
      }
      accessRoutes.forEach(route => {
        // hidden: true 跳过不处理
        if (!route.meta?.hidden) {
          // console.log(route.path);
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
              // console.log(route.children[0].name, route.children[0]);
              menuList.push({
                // menu 是路由名, 也作为 i18n 的标记
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
