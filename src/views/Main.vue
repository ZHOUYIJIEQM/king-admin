<template>
  <el-container class="common-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-box">
      <el-scrollbar>
        <div :class="['logo-title', isCollapse ? 'collapse' : 'expand' ]">
          <img src="../assets/img/home/logo.png" alt="王者荣耀" />
        </div>
        <el-menu
          ref="menuEl"
          class="el-menu-vertical-demo"
          background-color="#343843"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse-transition="false"
          :collapse="isCollapse"
          :default-active="defaultActive"
        >
          <template v-for="item in menuList.data">
            <template v-if="item.menuItem">
              <el-sub-menu :index="item.index">
                <template #title>
                  <el-icon>
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>{{item.menu}}</span>
                </template>
                <el-menu-item
                  v-for="(item1, index1) in item.menuItem"
                  :key="index1"
                  :index="item1.index"
                  @click="selectMenu(item1)"
                >{{item1.name}}</el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="item.index" @click="selectMenu(item)">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{item.menu}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container class="content">
      <el-header>
        <div class="left">
          <div class="tag-icon" @click="isCollapse = !isCollapse">
            <el-icon v-show="isCollapse"><Expand /></el-icon>
            <el-icon v-show="!isCollapse"><Fold /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/" @click="toMain">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadCrumb" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
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
      <el-scrollbar ref="mainScroll">
        <el-main>
          <!-- <router-view></router-view> -->
          <router-view v-slot="{ Component }">
            <keep-alive :exclude="/^.*?Exclude/">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { markRaw, getCurrentInstance, reactive, ref, watch, onMounted, computed } from "vue";
import { CaretBottom, Fold, Expand, List, Menu, Grid, Management, Ticket, UserFilled, } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ElNotification, ElMessageBox } from "element-plus";
import { commonStore } from "@/store/index"
import { permissionStore } from '@/store/permission'
import adminAvatar from '@/assets/img/home/admin.png'
import normalAvatar from '@/assets/img/home/normal.png'

const userName = permissionStore().userName
const userAuth = permissionStore().getAuth

const app: any = getCurrentInstance()

onMounted(() => {
  commonStore().setScrollEl(app?.proxy.$refs.mainScroll)
})

// 获取头像
const avatar = computed(() => {
  if (userAuth === '管理员') {
    return adminAvatar 
  }
  return normalAvatar
})

// 菜单
let menuList = reactive({
  data: permissionStore().menuList
})

// 面包屑内容
let breadCrumb = ref<string[]>([])
const setBreadCrumb = (val:string) => {
  firstLoop:
  for (const item1 of menuList.data) {
    breadCrumb.value = []
    if (item1.menuItem) {
      for (const item2 of item1.menuItem) {
        if (item2.index === val) {
          breadCrumb.value.push(item1.menu, item2.name)
          break firstLoop
        }
      }
    }
    if (item1.index === val) {
      breadCrumb.value.push(item1.menu)
      break firstLoop
    }
  }
}
// 选中菜单项
const selectMenu = (val:any) => {
  // console.log('点击了菜单项', val.index);
  defaultActive.value = val.index
  setBreadCrumb(val.index)
  router.push(val.index)
}


const route = useRoute()
const router = useRouter()
const { path } = route
// 默认的菜单
let defaultActive = ref<string>(path)
setBreadCrumb(defaultActive.value)
// 是否折叠状态
const isCollapse = ref(false);
const menuEl:any = ref(null)
// 点击首页
const toMain = () => {
  breadCrumb.value = []
  defaultActive.value = '/welcome'
  menuList.data.forEach((item) => {
    menuEl.value.close(item.index)
  })
}


watch(
  () => route.name,
  (newV, oldV) => {
    defaultActive.value = route.path
    let heroIndex = menuList.data.findIndex(i => i.menu === '英雄管理')
    let articleIndex = menuList.data.findIndex(i => i.menu === '文章管理')
    // console.log(articleIndex);
    if (newV === 'heroCreate') {
      menuList.data[heroIndex].menuItem?.unshift({
        name: '新增英雄',
        index: '/hero/create'
      })
      selectMenu({index: '/hero/create'})
    } else if (newV === 'heroEdit') {
      menuList.data[heroIndex].menuItem?.unshift({
        name: '编辑英雄',
        index: `/hero/edit/${route.params.id}`
      })
      selectMenu({index: `/hero/edit/${route.params.id}`})
    } else if (newV === 'articleCreate') {
      menuList.data[articleIndex].menuItem?.unshift({
        name: '新增文章',
        index: '/article/create'
      })
      selectMenu({index: '/article/create'})
    } else if (newV === 'articleEdit') {
      menuList.data[articleIndex].menuItem?.unshift({
        name: '编辑文章',
        index: `/article/edit/${route.params.id}`
      })
      selectMenu({index: `/article/edit/${route.params.id}`})
    } else {
      if ((menuList.data[heroIndex].menuItem as Array<any>).length > 1) {
        menuList.data[heroIndex].menuItem?.shift()
        // selectMenu({index: route.path})
      }
      if ((menuList.data[articleIndex].menuItem as Array<any>).length > 1) {
        menuList.data[articleIndex].menuItem?.shift()
        // selectMenu({index: route.path})
      }
    }
  },
  {
    immediate: true
  }
)

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
    sessionStorage.clear()
    commonStore().$reset()
    permissionStore().$reset()
    router.push({name: 'login'})
  })
};
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
  .aside-box {
    height: 100%;
    background-color: #343843;
    transition: width .2s;
    .logo-title {
      padding: 5px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #343843;
      &.collapse {
        img {
          width: 50px;
        }
      }
      img {
        width: 80px;
        transition: all .2s;
      }
    }

    .el-menu-vertical-demo {
      border: none;
      &:not(.el-menu--collapse) {
        width: 200px;
      }
      .el-sub-menu__title:hover {
        background-color: var(--el-menu-hover-bg-color);
      }
    }
  }
  .content {
    .el-header, .el-main {
      padding: 0;
      margin: 0;
    }
    .el-header {
      display: flex;
      align-items: center;
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
    .el-main {
      padding: 20px 15px 80px;
    }
  }
}
</style>

<style lang="scss">
.el-menu-item.is-active {
  background-color: #2c2f39;
}
.dropdown-menu {
  width: 130px;
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
