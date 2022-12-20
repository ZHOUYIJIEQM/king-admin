import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { markRaw } from "vue";
import { HomeFilled, Shop, Postcard, KnifeFork, List, Grid, Management, Ticket, UserFilled, Document } from "@element-plus/icons-vue";
import * as allRoutes from "@/router/index";

export const permissionStore = defineStore("permission", () => {
  // 用户名
  const userName = ref<string>("");
  // 用户角色
  const userRoles = ref<string[]>([]);
  // 左侧菜单
  const permissionMenu = ref<any[]>([]);

  // 判断角色数组中是否有一个与传入数组里的值相等
  function valueHasPermission(value: string[]) {
    return userRoles.value.some(role => value.includes(role));
  }

  function getAuth() {
    if (userRoles.value.includes("admin")) {
      return "管理员";
    }
    return "普通用户";
  }

  // 设置用户角色
  function setRoles() {
    if (Cookies.get("userRoles")) {
      userRoles.value = JSON.parse(Cookies.get("userRoles"));
    }
  }

  // 设置动态路由
  function setAsyncRoutes() {
    userName.value = Cookies.get("userName");
    setRoles();
    const filterRoutes = generateRoutes(allRoutes.asyncRoutes, userRoles.value);
    filterRoutes.forEach((route) => allRoutes.default.addRoute(route));
    const accessRoutes = allRoutes.routes.concat(filterRoutes);
    setMenuList(accessRoutes)
  }

  // 设置菜单
  function setMenuList(accessRoutes: any[]) {
    let menuList: any[] = []
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
      'Document': markRaw(Document),
    }
    // 生成菜单
    accessRoutes.forEach(route => {
      // 只处理不是 hidden: true 和 有子路由的, 根据情况修改
      if (!route.meta?.hidden && route.children?.length) {
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
    })
    permissionMenu.value= menuList
  }
  
  // 根据角色生成可以访问的路由
  function generateRoutes(asyncRoutes: any[], userRoles: string[]) {
    let res: any[] = [];
    asyncRoutes.forEach((route) => {
      const temp = { ...route };
      if (hasPermission(userRoles, temp)) {
        if (temp.children) {
          temp.children = generateRoutes(temp.children, userRoles);
        }
        res.push(temp);
      }
    });
    return res;
  }

  // 判断是否有权访问该路由
  function hasPermission(roles: string[], route) {
    if (route.meta?.roles) {
      return roles.some((role) => route.meta.roles.includes(role));
    }
    // 没有配置 route.meta.roles 默认可以访问
    return true;
  }

  return {
    userName,
    userRoles,
    getAuth,
    permissionMenu,
    setAsyncRoutes,
    valueHasPermission
  }
});
