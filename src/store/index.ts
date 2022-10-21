import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      // 滚动容器
      elScrollEl: null,
      // 上传路径
      uploadPath: "https://localhost:3080/admin/api/upload/",
      // uploadPath: "https://app.yjsjyb.top/admin/api/upload/",
      // 右侧提示停留时间
      tipDurationS: 1000,
      tipDurationM: 2000,
    };
  },
  getters: {
    getToken() {
      let token = sessionStorage.getItem("token");
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
  },
});
