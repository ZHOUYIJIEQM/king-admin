import { Directive } from "vue";
import { permissionStore } from "@/store/permission";

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const roles = permissionStore().roles
    // console.log(roles, binding);
    if (Array.isArray(value) && value?.length) {
      const hasPermission = roles.some(role => value.includes(role));
      if (!hasPermission) {
        el.parentElement.removeChild(el)
      }
    } else {
      throw new Error(`需要权限, 使用方法: v-permission="['abc']"`)
    }
  },
};
