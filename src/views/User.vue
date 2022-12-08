<template>
  <TableCard
    showSearch
    v-model:pagination="paginationData"
    v-model:visible="dialogVisible"
    :isAdd="isAdd"
    :totalNum="totalNum"
    :btnAdd="$t('btn.addUser')"
    :dialogTitle="isAdd ? $t('btn.addUser') : $t('btn.editUser')"
    @reloadData="reloadData"
    @addDataItem="addDataItem"
    @saveContent="saveContent"
  >
    <template #table>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        empty-text="暂无用户!"
        border
        @sort-change="sortChange"
      >
        <el-table-column align="center" type="index" :label="$t(`tableH.orderNum`)" width="70" />
        <el-table-column min-width="100px" :label="$t(`tableH.userName`)" prop="userName" />
        <el-table-column width="140px" :label="$t(`tableH.permissionLevel`)" prop="role">
          <template #default="scope">
            <span>{{getRole(scope.row.roles)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" :label="$t(`tableH.status`)" prop="status">
          <template #default="scope">
            <el-switch @change="statusChange(scope.row)" v-model="scope.row.status" style="--el-switch-on-color: #409eff; --el-switch-off-color: #f56c6c" />
          </template>
        </el-table-column>
        <el-table-column sortable="custom" width="165px" :label="$t(`tableH.updateDate`)" prop="updatedAt">
          <template #default="scope">
            <div>{{formatDate(scope.row.updatedAt)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="160">
          <template #default="scope">
            <div class="option" style="padding: 5px 0;">
              <el-button
                size="small"
                type="primary"
                plain
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >{{$t(`btn.modify`)}}</el-button>
              <el-button
                v-permission="['admin']"
                :style="{ 'margin-top': permissionStore().valueHasPermission(['admin']) ? '10px' : '' }"
                size="small"
                type="danger"
                plain
                :icon="Delete"
                @click="handleDelete(scope.row)"
              >{{$t(`btn.delete`)}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #dialog>
      <el-form label-position="right">
        <el-form-item label="用户名称">
          <el-input clearable v-model="formData.userName" placeholder="请输入用户名!"></el-input>
        </el-form-item>
        <el-form-item label="权限级别">
          <el-select multiple v-model="formData.roles" placeholder="请选择权限">
            <el-option
              v-for="item in ['admin', 'normal']"
              :key="item"
              :label="item === 'admin' ? '管理员' : '普通用户'"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-switch v-model="formData.status" style="--el-switch-on-color: #409eff; --el-switch-off-color: #f56c6c" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input type="password" show-password v-model="formData.passWord" placeholder="请输入密码!"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </TableCard>
</template>
<script lang="ts" setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { getUsers, createUser, updateUser, deleteUser, getUserByName } from '@/api/adminUser'
import { commonStore } from '@/store/index'
import { permissionStore } from "@/store/permission"
import { formatDate } from "@/utils/func"

const { proxy: { $lodash } }: any = getCurrentInstance()
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
// 是否添加
const isAdd = ref<boolean>(false)
// 表格数据
const tableData = ref<any[]>([])
// 表格加载提示
const tableLoading = ref<boolean>(false)
// 分页
const paginationData = reactive<any>({
  pageNum: 1,
  pageSize: 10,
})
// 分页, 总计
const totalNum = ref<number>(0)
// 请求搜索参数
let queryObj: any = {
  pageNum: 1,
  pageSize: 10,
  sortItem: 'updatedAt',
}
// 表单数据
const formData = ref<any>({})

// 点击编辑
const handleEdit = async (row: any) => {
  isAdd.value = false
  dialogVisible.value = true
  formData.value = $lodash.cloneDeep(row)
}
// 点击删除
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该物品吗?',
    '删除物品',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async response => {
    const res = await deleteUser(row._id)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.userName} ${res.data.message}`
      })
      await getTableData(queryObj)
    } else {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'error',
        message: res.data.message
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
}
// 转换角色
const getRole = (roles: string[]) => {
  return roles.map(i => i === 'admin' ? '管理员' : '普通用户').join(' / ')
}
// 获取表格数据
const getTableData = async (params: any) => {
  try {
    tableLoading.value = true
    let res: any = {}
    // console.log('请求参数', params);
    // 存在搜索名称, 使用搜索接口
    if (params?.name) {
      res = await getUserByName(params)
    } else {
      res = await getUsers(params)
    }
    // console.log(res.data);
    tableData.value = res?.data.data
    totalNum.value = res?.data.total
  } catch (error: any) {
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'error',
      message: error.message
    })
  } finally {
    setTimeout(() => {
      tableLoading.value = false
    }, 300)
  }
}
// 更新
const reloadData = async (queryParams: any) => {
  queryObj = Object.assign({}, queryObj, queryParams)
  await getTableData(queryObj)
}
// 点击添加
const addDataItem = async (val: any) => {
  isAdd.value = true
  dialogVisible.value = true
  formData.value = { status: true }
}
// 保存
const saveContent = async () => {
  try {
    tableLoading.value = true
    let res: any = {}
    if (isAdd.value) {
      res = await createUser(formData.value)
    } else {
      res = await updateUser(formData.value._id, formData.value)
    }
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: res.data.message
      })
    }
    dialogVisible.value = false
    await getTableData(queryObj)
  } catch (error: any) {
    console.log(error);
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'success',
      message: error.message
    })
  } finally {
    tableLoading.value = false
  }
}
// 状态改变
const statusChange = async (row: any) => {
  try {
    const res = await updateUser(row._id, row)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: res.data.message
      })
    } else {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: '更新失败!'
      })
    }
    await getTableData(queryObj)
  } catch (error) {
    console.log(error);
  }
}
// 排序
const sortChange = async (sortType: any) => {
  queryObj.orderType = sortType.order
  await getTableData(queryObj)
}

onMounted(async () => {
  await getTableData(queryObj)
})
</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';
</style>