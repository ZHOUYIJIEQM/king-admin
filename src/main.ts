import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/styles/reset.scss";
import api from "@/api/index";
import { createPinia } from "pinia";
import * as directives from "@/directives/index";
import i18n from "./i18n/index"
import "@/assets/js/iconfont.js"

const pinia = createPinia();
const app = createApp(App);

Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});

app.use(router);
app.use(api);
app.use(pinia);
app.use(i18n);
app.mount("#app");
