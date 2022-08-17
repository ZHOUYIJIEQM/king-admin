import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      elScrollEl: null,
      userName: "",
      token: "",
      uploadPath: "http://localhost:3080/admin/api/upload/",
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
  },
  actions: {
    setElScrollEl(val: any) {
      this.elScrollEl = val;
    },
    setUserName(val: string) {
      this.userName = val
    }
  },
});
