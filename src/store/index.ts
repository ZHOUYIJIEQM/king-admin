import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      elScrollEl: null,
      uploadPath: "http://localhost:3080/admin/api/upload/",
      userName: sessionStorage.getItem("userName"),
      userLevel: sessionStorage.getItem("userLevel"),
    };
  },
  getters: {
    getToken() {
      let token = sessionStorage.getItem("token");
      if (token) {
        return {
          Authorization: token
        };
      }
      return {};
    },
    getAuth() {
      console.log('=-=-', this.userLevel);
      if (this.userLevel && Number(this.userLevel) <= 1) {
        return '管理员'
      } else {
        return '普通用户'
      }
    }
  },
  actions: {
    setElScrollEl(val: any) {
      this.elScrollEl = val;
    },
  },
});
