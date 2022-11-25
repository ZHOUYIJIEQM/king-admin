<template>
  <TableCard
    showSearch
    v-model:pagination="paginationData"
    v-model:visible="dialogVisible"
    :totalNum="totalNum"
    :btnAdd="$t('btn.addArticle')"
    @reloadData="reloadData"
    @addDataItem="addDataItem"
  >
    <template #table>
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        empty-text="暂无文章!"
        border
        @sort-change="sortChange"
      >
        <el-table-column align="center" min-width="5%" type="index" :label="$t(`tableH.orderNum`)" width="70"></el-table-column>
        <el-table-column min-width="250px" :label="$t(`tableH.articleTitle`)" prop="name"></el-table-column>
        <el-table-column width="140px" :label="$t(`tableH.category`)" prop="category"></el-table-column>
        <el-table-column sortable="custom" width="165px" :label="$t(`tableH.createDate`)">
          <template #default="scope">
            <div>{{ formatDate(scope.row.createdTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" :label="$t(`tableH.operation`)" align="center" width="150">
          <template #default="scope">
            <div class="option" style="padding: 5px 0;">
              <el-button
                size="small"
                type="primary"
                plain
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >{{$t(`btn.edit`)}} / {{$t(`btn.view`)}}</el-button>
              <el-button
                size="small"
                :style="{ 'margin-top': permissionStore().valueHasPermission(['admin']) ? '10px' : '' }"
                v-permission="['admin']"
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
  </TableCard>
</template>
<script lang="ts" setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { getArticleList, articleSearch, deleteArticle } from '@/api/article'
import { formatDate } from "@/utils/func"
import { commonStore } from "@/store/index"
import { permissionStore } from "@/store/permission"

const route = useRoute()
const router = useRouter()
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
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
  sortItem: 'createdTime',
}

// 添加
const addDataItem = () => {
  router.push({ name: 'articleCreate' })
}
// 更新
const reloadData = async (queryParams: any) => {
  queryObj = Object.assign({}, queryObj, queryParams)
  await getTableData(queryParams)
}
// 获取表格数据
const getTableData = async (params) => {
  try {
    tableLoading.value = true
    let res: any = {}
    if (params?.name) {
      res = await articleSearch(params)
    } else {
      res = await getArticleList(params)
    }
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
// 点击编辑
const handleEdit = (row: any) => {
  router.push({
    name: 'articleEdit',
    params: {
      id: row._id
    }
  })
}
// 删除
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该文章吗?',
    '删除文章',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async response => {
    const res = await deleteArticle(row._id)
    if (res.status === 200) {
      await getArticleList(queryObj)
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`
      })
    }
    await getTableData(queryObj)
  })
  .catch(err => {
    console.log(err);
  })
}
// 排序
const sortChange = async (sortType: any) => {
  queryObj.orderType = sortType.order
  await getTableData(queryObj)
}

onMounted(async () => {
  await getTableData(queryObj)
})

// 刷新
onActivated(async () => {
  if (route.query.reload === 'true') {
    await getTableData(queryObj)
  }
})

</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';
</style>
