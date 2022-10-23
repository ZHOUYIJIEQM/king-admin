<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { commonStore } from '@/store/index'

const language = commonStore().languageType
const locale = computed(() => {
  if (language === 'zh') {
    return zhCn
  }
  return en
})

</script>

<template>
  <!-- element-plus 设置为中文 -->
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

