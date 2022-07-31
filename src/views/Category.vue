<template>
  <div class="category-page">
    <el-card class="main-card">
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <el-table
        class="table"
        v-loading="isLoading"
        :data="cateList"
        row-key="_id"
        border
        empty-text="暂无分类!"
      >
        <!-- <el-table-column type="index" label="序列" width="100" align="center" /> -->
        <el-table-column prop="name" label="日期" min-width="200" />
        <el-table-column label="编辑" width="300" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="添加分类" @opened="dialogOpened" @closed="dialogClosed">
      <el-form :model="form" ref="formEl">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" ref="formName" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="form.desc" />
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader 
            placeholder="请选择分类"
            :options="cateList" 
            :props="props1" 
            v-model="form.parent"
            clearable 
            @change="handleSelectClass"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddSelect">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑分类" v-model="dialogEditVisible" @opened="dialogOpened" @closed="dialogClosed">
      <el-form :model="editForm" ref="editFormEl">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.name" ref="editFormName" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="editForm.desc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
import { Delete, Edit, } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';

const app: any = getCurrentInstance()
const $http = app.proxy.$http
const {getCategoryList} = app.proxy.$CateApi

let isLoading = ref<boolean>(false)

// 获取分类
let cateList = ref([])
const getCateList = async () => {
  // 加载提示
  isLoading.value = true
  const cateRes = await $http.get('/rest/category')
  // const cateRes = await getCategoryList()
  // console.log('-----', cateRes);
  const { data } = cateRes
  // 选择分类 同时也是关联
  cateList.value = data
  // console.log(cateList.value);
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

// 编辑
let dialogEditVisible = ref(false)
let editForm = reactive({
  name: '',
  desc: '',
})
let updateId:string = ''
const handleEdit = async (index: number, row: any) => {
  updateId = row._id
  editForm.name = row.name
  dialogEditVisible.value = true
  await nextTick()
  app?.ctx.$refs.editFormName.focus()
}
const confirmEdit = async () => {
  let res = await $http({
    url: `/rest/categories/${updateId}`,
    method: 'put',
    data: editForm
  })
  if (res.status === 200) {
    ElMessage({
      type: 'success',
      message: '编辑成功!'
    })
  }
  getCateList()
  dialogEditVisible.value = false
}

// 删除分类
const handleDelete = async (index: number, row: any) => {
  // console.log(index, row)
  ElMessageBox.confirm(
    '确定要删除该分类吗?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async res => {
    const delRes = await $http({
      url: `/rest/categories/${row._id}`,
      method: 'delete'
    })
    if (delRes.status === 200) {
      ElMessage({
        type: 'success',
        message: `${row.name} 删除成功!`,
      })
      getCateList()
    }
  })
  .catch(err => {
    // console.log('取消删除', err);
  })
}

// 添加分类
const dialogFormVisible = ref(false)
const addCate = async () => {
  dialogFormVisible.value = true
  await nextTick()
  app?.ctx.$refs.formName.focus()
}
let form = reactive({
  name: '',
  desc: '',
  parent: null
})
const props1 = {
  expandTrigger: 'hover',
  checkStrictly: true,
  value: '_id',
  label: 'name',
  children: 'children',
  emitPath: false,
}
const handleSelectClass = () => { }
// 确定 添加
const confirmAddSelect = async () => {
  const addSelectRes = await $http({
    url: '/rest/categories',
    method: 'post',
    data: form
  })
  if (addSelectRes?.status) {
    getCateList()
    dialogFormVisible.value = false
    ElMessage({
      message: '添加分类成功!',
      type: 'success'
    })
  } else {
    ElMessage({
      message: '添加分类失败!',
      type: 'error'
    })
  }
}

// dialog 打开后输入框获取焦点
const dialogOpened = async () => {
  // await nextTick()
  // app?.ctx.$refs.formName?.focus()
  // app?.ctx.$refs.editFormName?.focus()
}
// dialog 关闭
const dialogClosed = () => {
  // 写法无效
  // form = {
  //   name: '',
  //   desc: '',
  //   parent: null
  // }

  form.name = ''
  form.desc = ''
  form.parent = null

  editForm.name = '',
  editForm.desc = ''
}

onMounted(async () => {
  await getCateList()
  
})

</script>
<style lang="scss" scoped>
.category-page {
  .main-card {
    .table {
      margin-top: 20px;
    }
  }
  :deep(.el-dialog) {
    padding: 15px 20px;
  }
  :deep(.el-dialog__body) {
    padding-bottom: 0;
  }
}
</style>