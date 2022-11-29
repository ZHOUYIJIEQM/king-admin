import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { permissionStore } from "./permission"

export const commonStore = defineStore("common", {
  state: () => {
    return {
      // 滚动容器
      elScrollEl: null,
      // 请求路径
      baseUrl: "http://localhost:3080/admin/api/resource",
      // baseURL: "http://192.168.1.5:3080/admin/api/resource",
      // baseURL: "https://app.yjsjyb.top/admin/api/resource",
      featureBaseUrl: "http://localhost:3080/admin/api",
      // 上传路径
      uploadPath: "http://localhost:3080/admin/api/upload",
      // uploadPath: "https://app.yjsjyb.top/admin/api/upload/",
      // 右侧提示停留时间
      tipDurationS: 1500,
      tipDurationM: 3000,
      // 过期时长(5小时) ms
      expiredTime: 5 * 60 * 60 * 1000,
      // 语言
      languageType: localStorage.language || "zh",
      // 桌面/移动端
      device: 'mobile',
      // 菜单栏是否展开
      isCollapse: false
    };
  },
  getters: {
    getToken() {
      const token = Cookies.get("token");
      if (token) {
        // todo: 查看修复
        return { Authorization: token };
      }
      return {};
    },
  },
  actions: {
    setScrollEl(val: any) {
      this.elScrollEl = val;
    },
    logout() {
      // 清除 cookie
      Object.keys(Cookies.get()).forEach((item: string) => {
        Cookies.remove(item)
      })
      commonStore().$reset()
      permissionStore().userRoles = []
    }
  },
});
