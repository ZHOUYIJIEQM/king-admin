<template>
  <el-dropdown
    class="translate-box"
    trigger="click"
    placement="bottom"
    :hide-on-click="false"
  >
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-zhongyingwenyuyan"></use>
    </svg>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="(item, index) in languageDownItem" 
          :key="index"
          :class="{active: language === item.type }"
          @click="switchLanguage(item.type)"
        >
          {{item.name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

interface languageItem {
  name: string
  type: string
}

let languageDownItem: languageItem [] = reactive([
  {
    name: '中文',
    type: 'zh'
  },
  {
    name: 'English',
    type: 'en'
  }
])
let language = ref<string|undefined>()
language.value = localStorage.language || 'zh'

const switchLanguage = (type: string) => {
  // 更换后执行操作
  if (i18n.locale.value !== type) {
    i18n.locale.value = type
    localStorage.language = type
    language.value = type
  }
}

</script>
<style lang="scss" scoped>
.translate-box {
  cursor: pointer;
  padding: 8px;
  &:hover {
    background: #eee;
  }
}
.icon {
  width: 24px;
  height: 24px;
  color: #525252;
}
:deep(.active) {
  color: #409eff;
  cursor: not-allowed;
}
</style>