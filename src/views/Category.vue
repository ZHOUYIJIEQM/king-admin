<template>
  <TableCard
    :isAdd="isAdd"
    :btnAdd="$t('btn.addCate')"
    :dialogTitle="isAdd ? $t('btn.addCate') : $t('btn.editCate')"
    v-model:visible="dialogVisible"
    @addDataItem="addDataItem"
    @saveContent="saveContent"
  >
    <template #table>
      <el-table 
        v-loading="tableLoading" 
        :data="tableData" 
        row-key="_id" 
        border 
        empty-text="暂无分类!" 
        default-expand-all
      >
        <el-table-column prop="name" :label="$t(`tableH.category`)" min-width="200" />
        <el-table-column :label="$t(`tableH.edit`)" width="250" align="center">
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
    </template>
    <template #dialog>
      <el-form 
        :model="formData" 
        ref="formEl" 
        :label-width="lableWidth"
      >
        <el-form-item :label="$t(`label.cateName`)">
          <el-input :placeholder="$t(`label.cateName`)" v-model="formData.name" ref="nameEl" />
        </el-form-item>
        <el-form-item :label="$t(`label.cateDes`)">
          <el-input :placeholder="$t(`label.cateDes`)" v-model="formData.desc" />
        </el-form-item>
        <el-form-item v-if="showCascader" :label="$t(`label.cateSelect`)">
          <el-cascader
            :placeholder="$t(`label.cateSelect`)"
            :options="tableData"
            :props="cascaderProps"
            v-model="formData.parent"
            clearable />
        </el-form-item>
      </el-form>
    </template>
  </TableCard>
</template>
<script lang="ts" setup>
import { Delete, Edit, } from '@element-plus/icons-vue'
import { getCategoryList, createCate, deleteCate, updateCate } from '@/api/category'
import { commonStore } from '@/store/index'

const { proxy }: any = getCurrentInstance()
const { $lodash } = proxy
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
// 是否添加
const isAdd = ref<boolean>(false)
// 表格数据
const tableData = ref<any []>([])
// 表格加载提示
const tableLoading = ref<boolean>(false)
// 表单数据
const formData = ref<any>({})
// 是否显示级联
const showCascader = ref<boolean>(false)
// label 宽度
const lableWidth = computed(() => {
  if (commonStore().languageType === 'zh') {
    return 85
  }
  return 120
})
// 级联
const cascaderProps = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: '_id',
  label: 'name',
  children: 'children',
  emitPath: false,
}
// 添加
const addDataItem = async () => {
  isAdd.value = true
  dialogVisible.value = true
  formData.value = {}
  showCascader.value = true
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 50)
}
// 保存
const saveContent = async () => {
  tableLoading.value = true
  dialogVisible.value = false
  let res: any = {}
  if (isAdd.value) {
    res = await createCate(formData.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: '添加分类成功!',
        type: 'success',
      })
    }
  } else {
    res = await updateCate(formData.value._id, formData.value)
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
// 获取表格数据
const getTableData = async () => {
  try {
    tableLoading.value = true
    const res = await getCategoryList()
    tableData.value = res.data
  } catch (error) {
    console.log(error);
  } finally {
    tableLoading.value = false
  }
}
// 点击编辑
const handleEdit = async (index: number, row: any) => {
  isAdd.value = false
  dialogVisible.value = true
  formData.value = $lodash.cloneDeep(row)
  if (row.parent) {
    showCascader.value = true
  } else {
    showCascader.value = false
  }
  setTimeout(async () => {
    await nextTick()
    proxy.$refs.nameEl.focus()
  }, 100)
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
    try {
      tableLoading.value = true
      const delRes = await deleteCate(row._id)
      if (delRes.status === 200) {
        ElNotification({
          duration: commonStore().tipDurationS,
          title: 'Success',
          message: `分类删除成功!`,
          type: 'success',
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      await getTableData()
    }
  })
  .catch(err => {
    console.log('取消删除', err);
  })
}

onMounted(async () => {
  await getTableData()
})
</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';
:deep(.el-table) {
  .cell>.el-button:only-child {
    width: 100%;
  }
}
:deep(.el-cascader) {
  width: 100%;
}
</style>