<template>
  <div class="card-item-comp">
    <!-- 卡片 -->
    <div class="top">
      <div class="title">{{ title }}</div>
      <el-button text @click="close">
        <el-icon :size="18">
          <Close />
        </el-icon>
      </el-button>
    </div>
    <div class="center">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
interface Props {
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'closeItem'): void
}>()

function close() {
  emit('closeItem')
}

</script>
<style lang="scss" scoped>
.card-item-comp {
  border: 2px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 15px;
  transition: border 0.3s;
  &:hover {
    border: 2px solid #606060;
  }

  .top, .center {
    padding: 15px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0 5px 15px;
    border-bottom: 1px solid #e4e7ed;

    .title {
      font-weight: bold;
    }
  }
  .button {
    width: 100%;
    padding: 50px 0;

    &>span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}
:deep(.el-form) {
  .el-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
