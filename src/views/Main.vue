<template>
  <el-container class="common-layout">
    <!-- 菜单 -->
    <MenuList ref="menuListEl" :isCollapse="isCollapse" @clickMenu="selectMenu"></MenuList>
    <!-- 内容 -->
    <el-container class="content">
      <el-header>
        <div class="left">
          <div class="tag-icon" @click="isCollapse = !isCollapse">
            <el-icon v-show="isCollapse"><Expand /></el-icon>
            <el-icon v-show="!isCollapse"><Fold /></el-icon>
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
      <el-main class="main-content">
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
import Cookies from 'js-cookie'
import { Expand, Fold, CaretBottom } from "@element-plus/icons-vue";
import { commonStore } from "@/store/index"
import { permissionStore } from '@/store/permission'
import adminAvatar from '@/assets/img/home/admin.png'
import normalAvatar from '@/assets/img/home/normal.png'

const mainScroll = ref()
const route = useRoute()
const router = useRouter()
// 是否折叠
const isCollapse = ref(false);
// 面包屑内容
let breadCrumb = ref<string[]>([])
// 菜单dom
let menuListEl = ref<any>()

// 用户名
const userName = computed<string>(() => {
  return permissionStore().userName
})
// 用户角色
const userAuth = computed<string>(() => {
  return permissionStore().getAuth
})
// 根据用户角色设置头像
const avatar = computed(() => {
  if (Cookies.get("userRole") === "admin") {
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
const setBreadCrumb = (val: string) => {
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
  router.push({ name: 'welcome' })
  breadCrumb.value = []
  // 闭合打开的菜单
  menuListEl.value.closeSubMenu()
}

// 监听路由, 设置面包屑
watch(
  () => route.name, 
  (newV) => {
    if (newV === 'welcome') {
      breadCrumb.value = []
    }
    newV && setBreadCrumb(newV as string)
  }, 
  { immediate: true }
)

onMounted(() => {
  commonStore().setScrollEl(mainScroll.value)
})

// 退出
const loginOut = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗?',
    '退出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
    ElNotification({
      duration: commonStore().tipDurationS,
      title: 'Success',
      message: '退出成功!',
      type: 'success',
    })
    // 清除 cookie
    Object.keys(Cookies.get()).forEach((item: string) => {
      Cookies.remove(item)
    })
    commonStore().$reset()
    permissionStore().$reset()
    router.push({ name: 'login' })
  })
};
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100%;
  .content {
    .el-header, .el-main {
      padding: 0;
      margin: 0;
    }
    .el-header {
      display: flex;
      align-items: center;
      box-shadow: 0 1px 4px hsl(209deg 100% 8% / 8%);
      .left {
        display: flex;
        align-items: center;
        min-width: 300px;
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
            border-radius: 50%;
          }
        }
      }
    }
    .main-content {
      overflow: hidden;
    }
    .main-scroll {

    }
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