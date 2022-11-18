<template>
  <div class="main-page">
    <el-card>
      <el-button 
        style="margin-bottom: 20px;"
        class="add-cate" 
        v-permission="['admin']" 
        :icon="DocumentAdd" 
        plain 
        type="primary" 
        @click="addData"
      >{{ $t(`btn.addCate`) }}</el-button>
      <el-table 
        class="table" 
        v-loading="tableLoading" 
        :data="tableData" 
        row-key="_id" 
        border 
        :empty-text="emptyText" 
        default-expand-all
      >
        <!-- <el-table-column type="index" label="序列" width="100" align="center" /> -->
        <el-table-column prop="name" :label="$t(`tableH.category`)" min-width="200" />
        <el-table-column :label="$t(`tableH.edit`)" width="300" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              :icon="Edit" 
              plain 
              @click="handleEdit(scope.$index, scope.row)"
            > {{ $t(`btn.edit`) }} / {{ $t(`btn.view`) }}</el-button>
            <el-button 
              size="small" 
              type="danger" 
              :icon="Delete" 
              plain 
              v-permission="['admin']" 
              @click="handleDelete(scope.$index, scope.row)"
            >{{ $t(`btn.delete`) }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      draggable=""
      v-model="dialogVisible"
      :title="isAdd ? $t(`btn.addCate`) : $t(`label.cateTitle`)"
      @closed="dialogClosed"
    >
      <el-form 
        :model="cateForm" 
        ref="formEl" 
        :label-width="lableWidth"
      >
        <el-form-item :label="$t(`label.cateName`)">
          <el-input 
            :placeholder="$t(`label.cateName`)" 
            v-model="cateForm.name" 
            ref="formName" />
        </el-form-item>
        <el-form-item :label="$t(`label.cateDes`)">
          <el-input
            :placeholder="$t(`label.cateDes`)"
            v-model="cateForm.desc"/>
        </el-form-item>
        <el-form-item v-if="showCascader" :label="$t(`label.cateSelect`)">
          <el-cascader
            :placeholder="$t(`label.cateSelect`)"
            :options="tableData"
            :props="cascaderProps"
            v-model="cateForm.parent"
            clearable
            @change="handleSelectClass" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t(`btn.cancel`) }}</el-button>
          <el-button type="primary" @click="confirmAdd">{{ $t(`btn.confirm`) }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DocumentAdd, Delete, Edit, } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import { saveScrollH } from '@/utils/saveScroll'
saveScrollH()

const app: any = getCurrentInstance()
const { getCategoryList, createCate, deleteCate, updateCate } = app.proxy.$CateApi
// 表格空白提示
const emptyText = "暂无分类!"
// 表格数据
const tableData = ref<any []>([])
// 共有多少条数据
const totalDataNum = ref<number>(0)
// 表格是否加载中
const tableLoading = ref<boolean>(true)
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
// 是否添加 或是更新
const isAdd = ref<boolean>(false)
// label 宽度
const lableWidth = computed(() => {
  if (commonStore().languageType === 'zh') {
    return 90
  }
  return 120
})
// 原始
const oCateForm: any = {
  name: "",
  desc: "",
  parent: null,
}
// 分类表单
const cateForm = ref<any>(Object.assign({}, oCateForm))
// 级联
const cascaderProps = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: '_id',
  label: 'name',
  children: 'children',
  emitPath: false,
}
// 是否显示级联
const showCascader = ref<boolean>(false)
// 选中的id
let updateId: string = ''

// 添加
const addData = async () => {
  cateForm.value = Object.assign({}, oCateForm)
  isAdd.value = true
  dialogVisible.value = true
  showCascader.value = true
  setTimeout(() => {
    app.proxy.$refs.formName.focus()
  }, 50)
}
// 点击删除
const handleDelete = async (index: number, row: any) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async res => {
    tableLoading.value = true
    const delRes = await deleteCate(row._id)
    if (delRes.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: `分类 ${row.name} 删除成功!`,
        type: 'success',
      })
    }
    await getTableData()
  })
  .catch(err => {
    console.log('取消删除', err);
  })
}
// 点击编辑
const handleEdit = async (index: number, row: any) => {
  isAdd.value = false
  dialogVisible.value = true
  cateForm.value = Object.assign({}, row)
  updateId = row._id
  if (row.parent) {
    showCascader.value = true
  } else {
    showCascader.value = false
  }
  setTimeout(() => {
    app.proxy.$refs.formName.focus()
  }, 50)
}
// 获取表格数据
const getTableData = async () => {
  tableLoading.value = true
  const res = await getCategoryList()
  tableData.value = res.data
  tableLoading.value = false
}
// 弹出框关闭
const dialogClosed = async () => { }
// 点击保存
const confirmAdd = async () => {
  tableLoading.value = true
  dialogVisible.value = false
  if (isAdd.value) {
    const res = await createCate(cateForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: '添加分类成功!',
        type: 'success',
      })
    }
  } else {
    const res = await updateCate(updateId, cateForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: '更新成功!',
        type: 'success',
      })
    }
  }
  await getTableData()
}
// 选择分类
const handleSelectClass = () => {}

onMounted(async () => {
  await getTableData()
})

</script>
<style lang="scss" scoped>
:deep(.table) {
  .cell .el-button:only-child {
    width: 100%;
  }
}
:deep(.el-overlay-dialog) {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-dialog {
    margin: 0;
    .el-dialog__body {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
}
</style>