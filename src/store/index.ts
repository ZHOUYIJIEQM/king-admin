import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      elScrollEl: null,
      uploadPath: "https://localhost:3080/admin/api/upload/",
      // uploadPath: "https://app.yjsjyb.top/admin/api/upload/",
      userName: sessionStorage.getItem("userName"),
      userLevel: sessionStorage.getItem("userLevel"),
      tipDurationS: 1000,
      tipDurationM: 2000,
      menuList: []
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
    getAuth() {
      if (this.userLevel && Number(this.userLevel) <= 1) {
        return '管理员'
      } else {
        return '普通用户'
      }
    }
  },
  actions: {
    setScrollEl(val: any) {
      this.elScrollEl = val;
    },
    setMenuList(val: any) {
      this.menuList = val;
    }
  },
});
