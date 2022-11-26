<template>
  <div class="main-page">
    <el-card ref="elCardEl">
      <!-- 顶部 input 搜索,添加 -->
      <el-row style="min-width: 520px; margin-bottom: 20px;" v-if="isShow(['admin'])">
        <el-col :span="8" v-if="showSearch">
          <el-input
            class="search-input"
            clearable
            :placeholder="$t(searchPlaceholder)"
            v-model="searchQuery"
            @keyup.enter="handleSearch" 
          ></el-input>
        </el-col>
        <el-col :span="16">
          <el-button 
            v-if="showSearch"
            type="primary" 
            plain
            :icon="Search" 
            style="margin-left: 15px;"
            @click="handleSearch"
          >{{$t(`btn.search`)}}</el-button>
          <el-button 
            v-permission="['admin']"
            type="primary" 
            plain
            :icon="DocumentAdd" 
            :style="{ 'margin-left': showSearch? '15px' : '0px' }"
            @click="addData"
          >{{btnAdd}}</el-button>
        </el-col>
      </el-row>
      <!-- 表格插槽 -->
      <slot name="table"></slot>
      <!-- 分页 -->
      <div class="pagination-box" v-if="pagination.pageSize">
        <el-pagination
          small
          v-model:currentPage="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      class="add-item"
      v-model="visible"
      :title="dialogTitle"
      :width="dialogWidth"
      draggable
      @close="dialogClosed"
    >
      <el-scrollbar 
        class="dialog-scrollbar"
        ref="dialogScrollbarEl"
        max-height="60vh"
      >
        <!-- 弹出框插槽 -->
        <slot name="dialog"></slot>
      </el-scrollbar>
      <template #footer>
        <div class="bottom" v-permission="['admin']">
          <el-button class="save-btn" type="primary" plain @click="saveContent">{{$t(`btn.save`)}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Search, DocumentAdd } from '@element-plus/icons-vue'
import { commonStore } from '@/store/index'
import { permissionStore } from '@/store/permission'
import { saveScrollH } from '@/utils/saveScroll'

interface Props {
  // 是否显示搜索 input
  showSearch?: boolean;
  // 搜索 input 的placeholder
  searchPlaceholder?: string;
  // 添加按钮的内容
  btnAdd?: string;
  // 弹出框标题
  dialogTitle?: string;
  // 是否显示弹出框
  visible?: boolean;
  // 分页参数
  pagination?: any;
  // 分页总数据量
  totalNum?: number;
  // 弹出框宽度
  dialogWidth?: number | string;
}
const props = withDefaults(
  defineProps<Props>(),
  {
    showSearch: false,
    searchPlaceholder: 'placeholder.inputName',
    visible: false,
    btnAdd: '',
    dialogWidth: '500px',
    pagination: {}
  }
)

const emit = defineEmits<{
  // 更新弹出框绑定的数据
  (e: 'update:visible', value: boolean): void
  // 更新分页绑定的数据
  (e: 'update:pagination', value: any): void
  // 搜索词改变后触发
  (e: 'searchChange', value: any): void
  // 重新获取数据
  (e: 'reloadData', value: any): void
  // 添加数据项
  (e: 'addDataItem'): void
  // 点保存
  (e: 'saveContent'): void
  // 关闭弹出框
  (e: 'dialogClosed'): void
}>()

// el-card 
const elCardEl = ref<any>()
const dialogScrollbarEl = ref<any>()
defineExpose({dialogScrollbarEl})
// 搜索词
const searchQuery = ref<string>('')
// 记录没有搜索词时的分页页数
let lastPageNum: number = 0
// 防抖
let timer: number | null = null
// 搜索词变化处理函数
const watchSearchQuery = async (newV, oldV) => {
  // 如果没有搜索词时页数, 就记录
  !lastPageNum && (lastPageNum = props.pagination.pageNum || 1)
  // input 值从有到没有, 表示清除 input 搜索词, 恢复记录好的页数
  if (oldV.length && !newV.length) {
    props.pagination.pageNum = lastPageNum
    lastPageNum = 0
  }
  timer && clearTimeout(timer)
  timer = setTimeout(async () => {
    lastPageNum && (props.pagination.pageNum = 1)
    // 请求参数
    let queryObj = Object.assign({}, props.pagination, { name: newV })
    emit('reloadData', queryObj)
  }, 500)
}
// 监听搜索词变化
watch(searchQuery, watchSearchQuery)
// 触发搜索
const handleSearch = async (val: any) => {
  emit('reloadData', val)
}
// 添加数据
const addData = async () => {
  emit('addDataItem')
}
const isShow = (value) => {
  return permissionStore().valueHasPermission(value) || props.showSearch
}
// 每页数量改变
const handleSizeChange = async () => {
  let queryObj = Object.assign({}, props.pagination)
  if (searchQuery.value) {
    queryObj = Object.assign(queryObj, { name: searchQuery.value })
  }
  emit('reloadData', queryObj)
}
// 当前页数切换
const handleCurrentChange = async () => {
  let queryObj = Object.assign({}, props.pagination)
  if (searchQuery.value) {
    queryObj = Object.assign(queryObj, { name: searchQuery.value })
  }
  emit('reloadData', queryObj)
}
// 保存
const saveContent = () => {
  emit('saveContent')
}
// 弹出框关闭时
const dialogClosed = () => {
  emit('dialogClosed')
}
// 弹出框显/隐触发
watch(
  () => props.visible,
  (newV) => {
    emit('update:visible', newV)
  }
)

const boxEl = computed<any>(() => {
  return commonStore().elScrollEl
})

// watch(
//   boxEl,
//   async (newV) => {
//     if (newV) {
//       // console.log(newV.wrap$.offsetHeight, elCardEl.value.$el.querySelector('.el-card__body'));
//       console.log(elCardEl.value);
//       await nextTick()
//       setTimeout(() => {
//         elCardEl.value.$el.querySelector('.el-card__body').style = `min-height: ${newV.wrap$.offsetHeight - 120}px;`
//       }, 500)
//     }
//   },
//   { deep: true }
// )

onMounted(async () => {
  // 保存/恢复滚动高度
  saveScrollH();
  await nextTick()
  elCardEl.value.$el.querySelector('.el-card__body').style = `min-height: ${boxEl.value.wrap$.offsetHeight - 120}px;`
})
</script>
<style lang="scss" scoped>
.main-page {
  padding: 25px 25px 45px;
  .pagination-box {
    margin-top: auto;
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
  :deep(.el-card) {
    .el-card__body {
      display: flex;
      flex-direction: column;
    }
  }
  :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
    .el-dialog {
      margin: 0;
    }
  }
  :deep(.el-dialog) {
    .el-dialog__body {
      padding: 10px 0;
    }
    .el-dialog__footer {
      padding-bottom: 0;
      .bottom {
        padding-bottom: 20px;
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
}
</style>