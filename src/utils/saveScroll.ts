// 保存容器滚动高度
import { computed, onActivated } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { commonStore } from "@/store/index";

const elScrollEl = computed<any>(() => {
  return commonStore().elScrollEl
})

export function saveScrollH() {
  let scrollH: number = 0;
  onActivated(() => {
    if (elScrollEl.value) {
      elScrollEl.value.setScrollTop(scrollH)
    }
  });
  
  onBeforeRouteLeave((to, from, next) => {
    if (elScrollEl.value) {
      scrollH = elScrollEl.value.wrap$.scrollTop
    }
    next()
  });
}
