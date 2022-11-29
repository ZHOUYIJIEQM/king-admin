import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import lodash from 'lodash';
import * as directives from "@/directives/index";
import i18n from "@/i18n/index";
import "./permission";
import "@/styles/reset.scss";

const pinia = createPinia();
const app = createApp(App);

Object.keys(directives).forEach((key) => {
  // 注册指令
  app.directive(key, directives[key]);
});

app.config.globalProperties.$lodash = lodash

app.use(router);
app.use(pinia);
app.use(i18n);
app.mount("#app");
