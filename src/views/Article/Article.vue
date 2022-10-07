<template>
  <div class="article-page">
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input 
            clearable 
            placeholder="请输入文章名称" 
            v-model="articleQuery"
            @keyup.enter="searchArticle"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-button 
            type="primary" 
            plain
            :icon="Search" 
            style="margin-left: 15px;"
            @click="searchArticle"
          >搜索</el-button>
          <el-button 
            type="primary" 
            plain
            :icon="DocumentAdd" 
            style="margin-left: 15px;"
            @click="addArticle"
          >添加新文章</el-button>
        </el-col>
      </el-row>
      <el-table
        style="margin-top: 15px;"
        :data="articleList"
        v-loading="tableLoading"
        empty-text="暂无英雄数据!"
        border
        stripe
      >
        <el-table-column min-width="5%" type="index" label="序号" width="60"></el-table-column>
        <el-table-column min-width="45%" label="文章标题" prop="title"></el-table-column>
        <el-table-column min-width="20" label="文章分类" prop="cate"></el-table-column>
        <el-table-column min-width="20%" label="创建时间">
          <template #default="scope">
            <div>{{ scope.row.createdTime?.split(' ').at(0) }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="10%" label="操作" align="center" width="150">
          <template #default="scope">
            <div class="option">
              <el-button
                size="small"
                type="primary"
                plain
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >查看 / 编辑</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                :icon="Delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-show="!isQuery">
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
import { ref, reactive, watch, getCurrentInstance, onMounted } from "vue";
import { DocumentAdd, Search, Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { ElNotification, ElMessageBox } from 'element-plus';
import loading from '@/utils/loading'

const app: any = getCurrentInstance();
const { getArticleList, articleSearch, deleteArticle } = app.proxy.$ArticleApi;
const router = useRouter()

const queryObj = reactive({
  pageNum: 1,
  pageSize: 10,
})
const articleQuery = ref<string>('')
const articleList = ref<any[]>([])
const tableLoading = ref<boolean>(true)
const totalArticle = ref<number>(0)
const isQuery = ref<boolean>(false)
const searchArticle = async ($event: any) => {
  isQuery.value = true
  $event.target.blur()
  try {
    tableLoading.value = true
    let res = await articleSearch({'title': articleQuery.value})
    res.data.forEach((item: any) => {
      item.cate = item.cate.map((i: any) => i.name).join('/')
    })
    articleList.value = res.data
    queryObj.pageNum = 1
  } catch (error) {
    console.log('搜索失败', error);
  } finally {
    tableLoading.value = false
  }
}
const addArticle = () => {
  router.push({ name: 'articleCreate' })
}
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
        type: 'success',
        message: `${row.title} ${res.data.message}`
      })
    } else {
      ElNotification({
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

watch(
  articleQuery,
  async (newV) => {
    if (!newV.trim().length) {
      isQuery.value = false
      await getArticle()
    }
  }
)

const getArticle = async () => {
  tableLoading.value = true
  let res = await getArticleList(queryObj)
  totalArticle.value = res.data.total
  res.data.data.forEach((item: any) => {
    item.cate = item.cate.map((i: any) => i.name).join('/')
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
.article-page {
  min-width: 780px;
  :deep(.el-table) {
    .option {
      display: flex;
      flex-wrap: wrap;
      .el-button {
        width: 100%;
        margin-left: 0;
        &:last-child {
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
