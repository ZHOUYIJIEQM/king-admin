<template>
  <el-container class="common-layout">
    <el-aside width="auto" class="aside-box">
      <el-scrollbar>
        <div :class="['logo-title', isCollapse ? 'collapse' : 'expand' ]">
          <img src="../assets/img/home/logo1.png" alt="王者荣耀" />
        </div>
        <el-menu
          ref="menuEl"
          class="el-menu-vertical-demo"
          background-color="#1f2d48"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :collapse="isCollapse"
          :default-active="defaultActive"
        >
          <el-sub-menu
            v-for="(item, index) in menuList"
            :key="index"
            :index="item.index"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{item.menu}}</span>
            </template>
            <template v-if="item.menuItem?.length">
              <el-menu-item
                v-for="(item1, index1) in item.menuItem"
                :key="index1"
                :index="item1.index"
                @click="selectMenu"
              >{{item1.name}}</el-menu-item>
            </template>
            <template v-if="item.menuItemGroup?.length">
              <el-menu-item-group
                v-for="(item1, index1) in item.menuItemGroup"
                :key="index1"
              >
                <template #title>{{item1.groupName}}</template>
                <el-menu-item
                  v-for="(item2, index2) in item1.menuItemList"
                  :key="index2"
                  :index="item2.index"
                >{{item2.name}}</el-menu-item>
              </el-menu-item-group>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container class="content">
      <el-header>
        <div class="left">
          <!-- <el-button type="primary" @click="isCollapse = !isCollapse">切换</el-button> -->
          <div class="tag-icon" @click="isCollapse = !isCollapse">
            <el-icon v-if="isCollapse"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/" @click="toMain">首页</el-breadcrumb-item>
            <el-breadcrumb-item></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-button>退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Fold, Expand, List, Menu, Grid, Management, Ticket, UserFilled, } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const menuList = [
  {
    menu: '分类管理',
    index: '1',
    icon: Grid,
    menuItem: [
      {
        name: '分类列表',
        index: '/category',
      },
    ]
  },
  {
    menu: '物品管理',
    index: '2',
    icon: Menu,
    menuItem: [
      {
        name: '物品列表',
        index: '/goods',
      },
    ]
  },
  {
    menu: '英雄管理',
    icon: Management,
    index: '3',
    menuItem: [
      {
        name: '英雄列表',
        index: '/hero',
      },
    ]
  },
  {
    menu: '文章管理',
    icon: List,
    index: '4',
    menuItem: [
      {
        name: '文章列表',
        index: '/article',
      },
    ]
  },
  {
    menu: '广告位',
    icon: Ticket,
    index: '5',
    menuItem: [
      {
        name: '广告位列表',
        index: '/advertise',
      },
    ]
  },
  {
    menu: '用户管理',
    icon: UserFilled,
    index: '6',
    menuItemGroup: [
      {
        groupName: '用户',
        menuItemList: [
          {
            name: '用户列表',
            index: '/user',
          },
        ]
      }
    ]
  },
]

const selectMenu = (val:any) => {
  console.log(val.index);
}

const route = useRoute()
// const router = useRouter()
// let defaultActive = ref<string>('')
const { path: defaultActive } = route
const isCollapse = ref(false);

const menuEl:any = ref(null)
const toMain = () => {
  menuList.forEach((item) => {
    menuEl.value.close(item.index)
  })
}

const loginOut = () => {
  console.log("退出");
};
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
  .aside-box {
    height: 100%;
    background-color: #1f2d48;
    .logo-title {
      padding: 5px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1d2940;
      &.collapse {
        img {
          width: 50px;
        }
      }
      img {
        width: 80px;
        transition: all .25s;
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
      }
    }
    .el-main {

    }
  }
}
</style>
