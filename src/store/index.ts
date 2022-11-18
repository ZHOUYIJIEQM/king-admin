import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      // 滚动容器
      elScrollEl: null,
      // 上传路径
      uploadPath: "http://localhost:3080/admin/api/upload",
      // uploadPath: "https://app.yjsjyb.top/admin/api/upload/",
      // 右侧提示停留时间
      tipDurationS: 1000,
      tipDurationM: 2000,
      // 语言
      languageType: localStorage.language || "zh",
      // 过期时长(5小时) ms
      expiredTime: 5 * 60 * 60 * 1000,
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
  },
});
