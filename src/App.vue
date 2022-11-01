<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// import { computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { commonStore } from '@/store/index'

const locale = computed(() => {
  if (commonStore().languageType === 'zh') {
    return zhCn
  }
  return en
})
</script>

<template>
  <!-- element-plus 设置为语言 -->
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

