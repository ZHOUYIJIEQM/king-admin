<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <!-- element-plus 设置为中文 -->
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

