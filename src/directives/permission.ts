import { Directive } from "vue";
import { permissionStore } from "@/store/permission";

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const userRoles = permissionStore().userRoles
    // console.log(roles, binding);
    if (Array.isArray(value) && value?.length) {
      // 如果角色权限里不包含按钮权限, 就删除元素
      const hasPermission = userRoles.some(role => value.includes(role));
      if (!hasPermission) {
        // 如果没有权限就把按钮删除掉
        el.parentElement.removeChild(el)
      }
    } else {
      throw new Error(`需要使用权限, 使用方法: v-permission="['admin']"`)
    }
  },
};
