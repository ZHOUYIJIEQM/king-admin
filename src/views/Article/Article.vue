<template>
  <div class="main-page">
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            clearable
            :placeholder="$t('placeholder.articleName')"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-button 
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
            style="margin-left: 15px;"
            @click="addData"
          >{{$t(`btn.addArticle`)}}</el-button>
        </el-col>
      </el-row>
      <el-table
        style="margin-top: 15px;"
        :data="articleList"
        v-loading="tableLoading"
        empty-text="暂无英雄数据!"
        border
      >
        <el-table-column min-width="5%" type="index" :label="$t(`tableH.orderNum`)" width="70"></el-table-column>
        <el-table-column min-width="45%" :label="$t(`tableH.articleTitle`)" prop="name"></el-table-column>
        <el-table-column min-width="20" :label="$t(`tableH.category`)" prop="category"></el-table-column>
        <el-table-column min-width="20%" :label="$t(`tableH.createDate`)">
          <template #default="scope">
            <div>{{ formatDate(scope.row.createdTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" :label="$t(`tableH.operation`)" align="center" width="150">
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
                size="small"
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
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="queryObj.pageNum"
          v-model:page-size="queryObj.pageSize"
          :page-sizes="[10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalArticle"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { DocumentAdd, Search, Edit, Delete } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import {saveScrollH} from '@/utils/saveScroll'
saveScrollH()

const app: any = getCurrentInstance();
const { getArticleList, articleSearch, deleteArticle } = app.proxy.$ArticleApi;
const router = useRouter()
// 请求参数
const queryObj = reactive({ pageNum: 1, pageSize: 10 })
// 搜索词
const searchQuery = ref<string>('')
// 文章列表
const articleList = ref<any []>([])
// 表格是否加载中
const tableLoading = ref<boolean>(true)
// 符合的文章共有多少
const totalArticle = ref<number>(0)
// 处理搜索
const handleSearch = async ($event: any) => {
  $event.target.blur()
  try {
    tableLoading.value = true
    let res = await articleSearch({'name': searchQuery.value})
    res.data.forEach((item: any) => {
      item.category = item.category.map((i: any) => i.name).join('/')
    })
    articleList.value = res.data
    queryObj.pageNum = 1
  } catch (error) {
    console.log('搜索失败', error);
  } finally {
    tableLoading.value = false
  }
}
// 添加
const addData = () => {
  router.push({ name: 'articleCreate' })
}
// 修改
const handleEdit = (row: any) => {
  router.push({
    name: 'articleEdit',
    params: {
      id: row._id
    }
  })
}
/**
 * 删除
 */
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
    // console.log(response);
    const res = await deleteArticle(row._id)
    // console.log(res);
    if (res.status === 200) {
      await getArticle()
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`
      })
    } else {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'error',
        message: res.data.message
      })
    }
  })
  .catch(err => {
    // console.log(err);
  })
}
// 每页条数改变
const handleSizeChange = async (val: number) => {
  queryObj.pageSize = val
  tableLoading.value = true
  await getArticle()
  tableLoading.value = false
}
// 页数改变
const handleCurrentChange = async (val: number) => {
  queryObj.pageNum = val
  tableLoading.value = true
  await getArticle()
  tableLoading.value = false
}

// 时间戳 转格式为 2021-1-26 17:35:26
const formatDate = (time: number) => {
  const d = new Date(time)
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getDate()}`
}

watch(
  searchQuery,
  async (newV) => {
    if (!newV.trim().length) {
      await getArticle()
    }
  }
)

const getArticle = async () => {
  tableLoading.value = true
  let res = await getArticleList(queryObj)
  totalArticle.value = res.data.total
  res.data.data.forEach((item: any) => {
    item.category = item.category.map((i: any) => i.name).join('/')
  })
  articleList.value = res.data.data
  tableLoading.value = false
  // console.log(articleList.value);
}

onMounted(async () => {
  try {
    // loading.openLoading()
    await getArticle()
  } catch (error) {
    console.log(error);
  } finally {
    // loading.closeLoading()
  }
})

</script>
<style lang="scss" scoped>
.main-page {
  min-width: 780px;
  :deep(.el-table) {
    .option {
      display: flex;
      flex-wrap: wrap;
      .el-button {
        width: 100%;
        margin-left: 0;
        &:nth-child(2) {
          margin-top: 10px;
        }
        // transition: all .2s;
      }
    }
  }
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
