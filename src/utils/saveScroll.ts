import { ref, onActivated } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { commonStore } from "@/store/index";

export function saveScrollH() {
  const route = useRoute();
  let scrollH: number = 0;
  onActivated(() => {
    let boxEl: any = commonStore().elScrollEl
    boxEl && boxEl.setScrollTop(scrollH)
  });
  
  onBeforeRouteLeave((to, from, next) => {
    let boxEl: any = commonStore().elScrollEl
    boxEl && (scrollH = boxEl.$refs.wrap$.scrollTop)
    // console.log('离开', route.name, scrollH);
    next()
  });
}
