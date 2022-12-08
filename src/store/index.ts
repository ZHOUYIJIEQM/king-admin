import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { permissionStore } from "./permission"

export const commonStore = defineStore("common", {
  state: () => {
    return {
      // 滚动容器
      elScrollEl: null,
      // 请求路径
      baseUrl: `${import.meta.env.VITE_BASE_API}/admin/api/resource`,
      // 登录功能
      featureBaseUrl: `${import.meta.env.VITE_BASE_API}/admin/api`,
      // 上传路径
      uploadPath: `${import.meta.env.VITE_BASE_API}/admin/api/upload`,
      // 右侧提示停留时间
      tipDurationS: 1500,
      tipDurationM: 3000,
      // 过期时长(5小时) ms
      expiredTime: 5 * 60 * 60 * 1000,
      // 语言
      languageType: localStorage.language || "zh",
      // 桌面/移动端
      device: 'desktop',
      // 小屏
      mobileWidth: 750,
      // 菜单栏是否展开
      sidebar: {
        opened: Cookies.get("sidebarStatus") ? Cookies.get("sidebarStatus") === 'true' : true,
        // 切换时不要过渡动画
        withoutAnimation: false
      }
    };
  },
  getters: {
    getToken() {
      const token = Cookies.get("token");
      if (token) {
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
    },
    changeSidebarStatus(val: boolean) {
      Cookies.set("sidebarStatus", val)
      this.sidebar.opened = val
    }
  },
});
