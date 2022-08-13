import { defineStore } from "pinia";

export const commonStore = defineStore("common", {
  state: () => {
    return {
      elScrollEl: null,
      token: "",
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
  },
});
