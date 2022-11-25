<template>
  <el-button class="add-item-btn" :style="{ width: width, height: height }" text @click="addCallback">
    <el-icon :size="iconSize">
      <Plus />
    </el-icon>
    <div :style="{ 'font-size': fontSize, 'margin-left': marginIcon }">{{ text }}</div>
  </el-button>
</template>
<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
const props = withDefaults(
  defineProps<{
    iconSize?: number;
    // 与左侧icon距离
    marginIcon?: string;
    width?: string;
    height?: string;
    fontSize?: string;
    text?: string;
  }>(),
  {
    iconSize: 30,
    marginIcon: '15px',
    width: '100%',
    height: '150px',
    fontSize: '16px',
    text: '添加'
  }
)

const emit = defineEmits<{
  (e: 'addCb'): void
}>()
const addCallback = () => {
  emit('addCb')
}
</script>
<style lang="scss" scoped>
.add-item-btn {
  display: flex;
  border: 2px solid var(--el-card-border-color);
  border-radius: 6px;
  margin-bottom: 15px;
  &:hover {
    border: 2px solid #606060;
  }
  &>span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>