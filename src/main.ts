import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import api from "@/api/index";
import * as directives from "@/directives/index";
import i18n from "@/i18n/index"
import "./permission"
import "@/assets/js/iconfont.js"
import "@/styles/reset.scss";

const pinia = createPinia();
const app = createApp(App);

Object.keys(directives).forEach((key) => {
  // 注册指令
  app.directive(key, directives[key]);
});

app.use(router);
app.use(api);
app.use(pinia);
app.use(i18n);
app.mount("#app");
