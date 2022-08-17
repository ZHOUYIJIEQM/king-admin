import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      elScrollEl: null,
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
    userName() {
      return sessionStorage.getItem("userName")
    }
  },
  actions: {
    setElScrollEl(val: any) {
      this.elScrollEl = val;
    },
  },
});
