<template>
  <TableCard
    showSearch
    v-model:pagination="paginationData"
    v-model:visible="dialogVisible"
    :isAdd="isAdd"
    :totalNum="totalNum"
    :btnAdd="$t('btn.addSummoner')"
    :dialogTitle="isAdd ? $t('btn.addSummoner') : $t('btn.editSummoner')"
    @reloadData="reloadData"
    @addDataItem="addDataItem"
    @saveContent="saveContent"
  >
    <template #table>
      <el-table
        border
        v-loading="tableLoading"
        empty-text="暂无召唤师技能!"
        :data="tableData"
        :default-sort="{ prop: 'rank', order: 'ascending' }"
        @sort-change="sortChange"
      >
        <el-table-column align="center" type="index" :label="$t(`tableH.orderNum`)" width="70" />
        <el-table-column align="center" width="80px" :label="$t(`tableH.name`)" prop="name" />
        <el-table-column width="90px" sortable="custom" :label="$t(`tableH.grade`)" align="center" prop="rank" />
        <el-table-column class-name="img-box" width="100px" :label="$t(`tableH.image`)" align="center" prop="img">
          <template #default="scope">
            <el-image lazy class="item-icon" :src="scope.row.img" />
          </template>
        </el-table-column>
        <el-table-column min-width="250px" :label="$t(`tableH.desc`)" prop="description">
          <template #default="scope">
            <span style="font-weight: bold;">{{scope.row.description.split('CD：').at(0)}}CD：</span>
            <span>{{scope.row.description.split('CD：').slice(1).join('')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="150">
          <template #default="scope">
            <div class="option">
              <el-button
                size="small"
                type="primary"
                plain
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >{{$t(`btn.edit`)}} / {{$t(`btn.view`)}}</el-button>
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
      <el-form
        class="dialog-from"
        :model="formData" 
        label-width="70px"
        label-position="left"
      >
        <el-form-item label="技能名称">
          <el-input clearable ref="nameEl" v-model="formData.name" placeholder="请输入技能名称!"></el-input>
        </el-form-item>
        <el-form-item label="技能图标">
          <UploadFile
            class="icon-upload"
            :actionUrl="actionUrl"
            :imageUrl="imageUrl"
            @uploadSuccess="uploadSuccess"
          ></UploadFile>
        </el-form-item>
        <el-form-item label="解锁等级">
          <el-select v-model="formData.rank" placeholder="Select">
            <el-option
              v-for="item in 30"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="技能说明">
          <el-input clearable type="textarea" v-model="formData.description" placeholder="请输入技能描述!"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </TableCard>
</template>
<script lang="ts" setup>
import { getSummoner, createSummoner, updateSummoner, deleteSummoner, searchSummonerByName } from "@/api/summoner"
import { Delete, Edit } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import { permissionStore } from "@/store/permission"

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
  sortItem: 'rank',
  orderType: 'ascending'
}
// 表单数据
const formData = ref<any>({})
// 上传的图片地址
const imageUrl = ref<string>('')
// 上传接口
const actionUrl = computed<string>(() => {
  return `${commonStore().uploadPath}/inscription`
})
// 上传成功
const uploadSuccess = (val: string) => {
  imageUrl.value = val
  formData.value.icon = val
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
  imageUrl.value = ''
  formData.value = {
    desc: [""]
  }
}
// 保存
const saveContent = async () => {
  try {
    tableLoading.value = true
    let res: any = {}
    if (isAdd.value) {
      res = await createSummoner(formData.value)
    } else {
      res = await updateSummoner(formData.value._id, formData.value)
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
// 排序
const sortChange = async (sortType: any) => {
  queryObj.orderType = sortType.order
  await getTableData(queryObj)
}
// 编辑
const handleEdit = async (row: any) => {
  dialogVisible.value = true
  isAdd.value = false
  imageUrl.value = row.img
  formData.value = $lodash.cloneDeep(row)
  await nextTick()
  // note: 有坑, 在 nextTick 后 el-input 没有获取焦点, 但用setTimeout可以。不加 nextTick, 只用 setTimeout 获取焦点时, 光标出现在字符串第一位
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 50)
}
// 删除属性
const deleteProperty = (arr: any, index: number) => {
  if (arr.length > 1) {
    arr.splice(index, 1)
  } else {
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'warning',
      message: '至少需有一个!'
    })
  }
}
// 删除
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该铭文吗?',
    '删除铭文',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async response => {
    const res = await deleteSummoner(row._id)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`
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
// 获取表格数据
const getTableData = async (params: any) => {
  try {
    tableLoading.value = true
    let res: any = {}
    // console.log('请求参数', params);
    // 存在搜索名称, 使用搜索接口
    if (params?.name) {
      res = await searchSummonerByName(params)
    } else {
      res = await getSummoner(params)
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

onMounted(async () => {
  await getTableData(queryObj)
})
</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';
:deep(.el-table) {
  td.img-box {
    padding: 0;
    .cell {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      aspect-ratio: 1;
      img {
        border-radius: 50%;
      }
    }
  }
}
.expand {
  padding: 0 15px;
  div {
    line-height: 1.8;
  }
}
:deep(.el-form) {
  .el-upload {
    width: 50px !important;
    max-height: 60px !important;
    min-height: 50px !important;
  }
}
</style>