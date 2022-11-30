<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <div :class="['logo-title', isOpen ? 'collapse' : 'expand']">
        <img src="../assets/img/home/logo.png" alt="王者荣耀" />
      </div>
      <el-menu
        ref="menuEl"
        class="vertical-menu"
        background-color="#343843"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isOpen"
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
      >
        <template v-for="item in menuList">
          <template v-if="item?.children">
            <el-sub-menu :index="item.menu">
              <template #title>
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{$t(changeKey(item.menu))}}</span>
              </template>
              <el-menu-item
                v-for="(item1, index1) in item.children"
                :key="index1"
                :index="item1.menu"
                @click="selectMenu(item1)"
              >{{$t(changeKey(item1.menu))}}</el-menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="item.menu" @click="selectMenu(item)">
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{$t(changeKey(item.menu))}}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { permissionStore } from "@/store/permission"
import { commonStore } from "@/store/index"
const route = useRoute()
// 菜单
const menuEl = ref()
// 需要暴露出来, 父组件通过 ref 才可以获取到子组件内容
// defineExpose({menuEl})

const isOpen = computed(() => {
  return !commonStore().sidebar.opened
})

// 折叠菜单
const closeSubMenu = () => {
  // console.log(menuEl.value);
  menuList.value.forEach((item: any) => {
    if (item.children?.length) {
      // https://element-plus.gitee.io/zh-CN/component/menu.html#menu-%E6%96%B9%E6%B3%95
      // element plus menu组件的方法, 文档并没要求第二个参数, 但没有时会报警告, 打印 menuEl.value 可以看到close函数的参数有两个, index, indexPath
      // indexPath 文档没有详细说明, 通过 <el-menu @open="open"></el-menu>, const open = (index, indexPath) => console.log(index, indexPath) 可以打印出来
      menuEl.value.close(item.menu, [item.menu])
    }
  })
}
defineExpose({ closeSubMenu })

const emit = defineEmits<{
  (e: 'clickMenu', item: any): void
}>()

// 选中状态的菜单
let activeMenu = ref<string>('')

// 菜单
let menuList = computed<any []>(() => {
  return permissionStore().permissionMenu
})

// 点击菜单
const selectMenu = (item: any) => {
  activeMenu.value = item.menu
  commonStore().device === 'mobile' && (commonStore().sidebar.opened = false)
  emit('clickMenu', item)
}

// i18n
const changeKey = (menu: string) => {
  return `menu.${menu}`
}

watch(
  () => route.name,
  (newV) => {
    // 退出登录后会清除菜单数组, 空数组时不用继续执行
    if (!permissionStore().permissionMenu.length) return
    
    // 激活的菜单
    activeMenu.value = newV as string

    // 子菜单动态添加
    let heroIndex = (permissionStore().permissionMenu as any []).findIndex(item => item.menu === 'hero')
    let articleIndex = (permissionStore().permissionMenu as any []).findIndex(item => item.menu === 'article')
    let heroChild = (permissionStore().permissionMenu as any [])[heroIndex].children
    let articlChild = (permissionStore().permissionMenu as any [])[articleIndex].children
    // 英雄管理子菜单
    if (['heroEdit', 'heroCreate'].includes(newV as string)) {
      heroChild.unshift({menu: newV})
    } else if (heroChild.length > 1) {
      heroChild.shift()
    }
    // 文章管理子菜单
    if (['articleEdit', 'articleCreate'].includes(newV as string)) {
      articlChild.unshift({menu: newV})
    } else if (articlChild.length > 1) {
      articlChild.shift()
    }
  },
  { immediate: true }
)

</script>
<style lang="scss" scoped>
.vertical-menu {
  border: none;
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
.sidebar-container {
  // width: 200px;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  transition: width .25s;
  background-color: #343843;
  // &.hideSidebar {
  //   width: 64px;
  // }
  .logo-title {
    padding: 5px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  
    &.collapse {
      img {
        width: 45px;
      }
    }
    img {
      width: 60px;
      transition: all .25s;
    }
  }
  :deep(.el-menu-item.is-active) {
    background-color: #2a2d36;
  }
}
</style>