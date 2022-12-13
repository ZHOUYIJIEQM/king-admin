<template>
  <el-container class="app-wrapper" :class="wrapperObj">
    <div class="drawer-bg" v-if="(device==='mobile' && sidebarOpen)" @click="handleClickOutside" />
    <!-- 菜单 -->
    <MenuList
      ref="menuListEl"
      class="sidebar-container"
      @clickMenu="selectMenu"
    ></MenuList>
   <!-- 内容 -->
    <el-container class="main-content">
      <el-header>
        <div class="left">
          <div class="tag-icon" @click="toggleCollapse">
            <el-icon v-show="!sidebarOpen"><Expand /></el-icon>
            <el-icon v-show="sidebarOpen"><Fold /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item to="/" @click="toMain">{{$t(`menu.home`)}}</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="(item, index) in breadCrumb" :key="index">{{$t(`menu.${item}`)}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <TranslateBtn style="margin-right: 10px;"></TranslateBtn>
          <el-dropdown trigger="click" placement="bottom-end">
            <span class="right-user">
              <el-image class="avatarPic" :src="avatar"></el-image>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <div class="dropdown-menu">
                <div>{{userName}}</div>
                <div>{{userAuth}}</div>
                <div class="out" @click="loginOut">退出</div>
              </div>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar class="main-scroll" ref="mainScroll">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <keep-alive :exclude="/^.*?Exclude/">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { Expand, Fold, CaretBottom } from "@element-plus/icons-vue";
import { commonStore } from "@/store/index"
import { permissionStore } from '@/store/permission'
import adminAvatar from '@/assets/img/home/admin.png'
import normalAvatar from '@/assets/img/home/normal.png'
import { storeToRefs } from "pinia";

const mainScroll = ref()
const route: any = useRoute()
const router = useRouter()
// 是否折叠
const { device } = storeToRefs(commonStore())
// 面包屑内容
const breadCrumb = ref<string[]>([])
// 菜单dom
const menuListEl = ref<any>()
// 外层类名
const wrapperObj = computed<any>(() => {
  return {
    'mobile': device.value === 'mobile',
    'hideSidebar': !commonStore().sidebar.opened,
    'openSidebar': commonStore().sidebar.opened,
    'withoutAnimation': commonStore().sidebar.withoutAnimation
  }
})
const sidebarOpen = computed(() => {
  return commonStore().sidebar.opened
})

// 用户名
const userName = computed<string>(() => {
  return permissionStore().userName
})
// 用户角色
const userAuth = computed<string>(() => {
  return permissionStore().getAuth()
})
// 根据用户角色设置头像
const avatar = computed(() => {
  if (permissionStore().userRoles.includes("admin")) {
    return adminAvatar 
  }
  return normalAvatar
})
// 菜单
const menuList = computed<any []>(() => {
  return permissionStore().permissionMenu
})

// 选中菜单项
const selectMenu = (val:any) => {
  // 设置面包屑
  setBreadCrumb(val.menu)
  router.push({ name: val.menu })
}

// 生成面包屑导航
const setBreadCrumb = async (val: string) => {
  // console.log('传入值', val, JSON.stringify(menuList.value, null, '  '));
  // 等待重新获取menuList.value的值
  await nextTick()
  firstLoop:
  for (let index = 0; index < menuList.value.length; index++) {
    breadCrumb.value = []
    let item1 = menuList.value[index]
    if (item1?.children) {
      for (let index1 = 0; index1 < item1.children.length; index1++) {
        const item2 = item1.children[index1];
        if (item2.menu === val) {
          breadCrumb.value.push(item1.menu, item2.menu)
          break firstLoop
        }
      }
    }
    if (item1.menu === val) {
      breadCrumb.value.push(item1.menu)
      break firstLoop
    }
  }
}

// 点击折叠按钮旁边的首页
const toMain = () => {
  router.push({ name: 'home' })
  breadCrumb.value = []
  // 闭合打开的菜单
  menuListEl.value.closeSubMenu()
}

// 切换显示
const toggleCollapse = () => {
  commonStore().sidebar.withoutAnimation = false
  commonStore().changeSidebarStatus(!commonStore().sidebar.opened)
}
// 关闭
const handleClickOutside = () => {
  commonStore().changeSidebarStatus(false)
}
// 窗口大小调整
const resizeHandler = () => {
  // 小屏隐藏菜单栏
  let status = document.body.getBoundingClientRect().width < commonStore().mobileWidth
  commonStore().sidebar.withoutAnimation = true
  status && (commonStore().sidebar.opened = false)
  commonStore().device = status ? 'mobile' : 'desktop'
}

// 监听路由, 设置面包屑
// watch(
//   () => route.name, 
//   (newV) => {
//     newV && setBreadCrumb(newV as string)
//   }, 
//   { immediate: true }
// )
watchEffect(() => {
  setBreadCrumb(route.name)
})

onMounted(() => {
  commonStore().setScrollEl(mainScroll.value)
  resizeHandler()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

// 退出
const loginOut = () => {
  ElMessageBox.confirm( '确定要退出登录吗?', '退出',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  .then(() => {
    commonStore().logout()
    ElNotification({
      duration: commonStore().tipDurationS,
      title: 'Success',
      message: '退出成功!',
      type: 'success',
    })
    router.push({ name: 'login' })
  }).catch(() => {})
};
</script>
<style lang="scss" scoped>
$sidebarW: 200px;
$collapseW: 64px;
$durationT: .25s;

.app-wrapper {
  height: 100%;

  &.withoutAnimation {
    .main-container, .sidebar-container {
      transition: none !important;
    }
  }

  &.hideSidebar {
    .sidebar-container {
      width: $collapseW;
    }
    .main-content {
      margin-left: $collapseW;
    }
  }

  &.openSidebar {
    .sidebar-container {
      width: $sidebarW;
    }
    .main-content  {
      margin-left: $sidebarW;
    }
  }

  .sidebar-container {
    transition: width $durationT;
  }
  .main-content {
    transition: margin-left $durationT;
  }

  // 移动端
  &.mobile {
    .sidebar-container {
      width: $sidebarW !important;
    }
    .main-content {
      margin-left: 0;
    }
    &.hideSidebar .sidebar-container {
      transition: transform $durationT;
      transform: translate3d(-$sidebarW, 0, 0);
    }
    &.openSidebar .sidebar-container {
      transition: transform $durationT;
      transform: translate3d(0, 0, 0);
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 1001;
  }
  .main-content {
    .el-header, .el-main {
      padding: 0;
      margin: 0;
    }
    .el-header {
      display: flex;
      align-items: center;
      box-shadow: 0 1px 4px hsl(209deg 100% 8% / 8%);
      z-index: 10;
      .left {
        display: flex;
        align-items: center;
        // min-width: 300px;
        .tag-icon {
          cursor: pointer;
          padding: 15px;
          .el-icon {
            font-size: 24px;
          }
        }
      }
      .right {
        margin-left: auto;
        margin-right: 15px;
        position: relative;
        display: flex;
        align-items: center;
        .content {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
        }
        .right-user {
          display: flex;
          align-items: center;
          cursor: pointer;
          .avatarPic {
            width: 35px;
            aspect-ratio: 1;
            border-radius: 50%;
          }
        }
      }
    }
    // .main-scroll {
    //   :deep(.el-scrollbar__view) {
    //     height: 100%;
    //   }
    // }
  }
}
</style>
<style lang="scss">
.dropdown-menu {
  width: 120px;
  &>div {
    padding: 8px 12px;
    font-size: var(--el-font-size-base);
    color: var(--el-text-color-regular);
    cursor: pointer;
    &:hover {
      background-color: var(--el-dropdown-menuItem-hover-fill);
      color: var(--el-dropdown-menuItem-hover-color);
    }
  }
  .out {
    border-top: 1px solid #ececec;
  }
}
</style>