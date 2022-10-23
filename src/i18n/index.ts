import { createI18n } from "vue-i18n";
import en from "./en";
import zh from "./zh";

const messages = {
  zh,
  en,
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.language || 'zh',
  messages,
});

export default i18n;
