<template>
  <div class="hero-page">
    <el-card>
      <!-- 顶部搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input 
            clearable 
            placeholder="请输入英雄名称" 
            v-model="heroQuery"
            @keyup.enter="searchHero"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-button 
            type="primary" 
            plain
            :icon="Search" 
            style="margin-left: 15px;"
            @click="searchHero"
          >搜索</el-button>
          <el-button 
            type="primary" 
            plain
            :icon="DocumentAdd" 
            style="margin-left: 15px;"
            @click="addHero"
          >添加新英雄</el-button>
        </el-col>
      </el-row>
      <el-table :data="heroList" v-loading="isLoading" empty-text="暂无英雄数据!" border stripe>
        <el-table-column type="expand" label="展开" width="60">
          <template #default="props">
            <!-- todo: 数据库里很多图片没用了, 需要修改 -->
            <div class="skills" v-for="item in props.row.skills" :key="item._id">
              <div class="skill">
                <img class="skill-icon" :src="item.icon" />
                <h3>{{item.name}}</h3>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="英雄名称" prop="name"></el-table-column>
        <el-table-column label="英雄称号" prop="title"></el-table-column>
        <el-table-column label="所属分类" border stripe>
          <template #default="scope">
            <span>{{category(scope.row.cate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像">
          <template #default="scope">
            <div class="hero-avatar-box">
              <img class="hero-avatar" :src="scope.row.avatar" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="option">
              <el-button
                size="small"
                type="primary"
                plain
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
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
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="pageParams.pagenum"
          v-model:page-size="pageParams.pagesize"
          :page-sizes="[10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';
import { DocumentAdd, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()
const app = getCurrentInstance()
const $http = app?.appContext.config.globalProperties.$http

const category = (data:any) => {
  return data.map((item:any) => item.name).join('/')
}

// input 查询词
const heroQuery = ref<string>('')
// 英雄列表
let heroList = ref([])
let total = ref(0)
// 请求页参数
interface GetGoods {
  pagenum: number,
  pagesize: number,
  query: string
}
let pageParams: GetGoods = {
  pagenum: 1,
  pagesize: 10,
  query: ''
}
// 加载提示
let isLoading = ref<boolean>(false)
// 获取英雄列表
const getHeroList = async () => {
  isLoading.value = true
  try {
    let res = await $http({
      url: '/rest/heros',
      params: pageParams
    })
    // console.log(res);
    if (res.status === 200) {
      heroList.value = res.data.data
      total.value = res.data.total
    }
  } catch (error) {
    console.log(error);
    ElMessage({
      type: 'error',
      message: '获取英雄列表出错!'
    })
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}
getHeroList()

// 每页条数改变
const handleSizeChange = (val: number) => {
  pageParams.pagesize = val
  getHeroList()
}
// 页数改变
const handleCurrentChange = (val: number) => {
  pageParams.pagenum = val
  getHeroList()
}
// 搜索
const searchHero = async (event:any) => {
  event.target.blur()
  pageParams.pagenum = 1
  pageParams.query = heroQuery.value
  getHeroList()
}
// 添加英雄
const addHero = () => {
  router.push({
    name: 'heroCreate'
  })
}
// 编辑
const handleEdit = (row: any) => {
  router.push({
    name: 'heroEdit',
    params: {
      id: row._id
    }
  })
}
// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该英雄吗?',
    '删除英雄',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async response => {
    console.log(response);
    const res = await $http({
      url: `/rest/heros/${row._id}`,
      method: 'delete'
    })
    console.log(res);
    if (res.status === 200) {
      getHeroList()
      ElMessage({
        type: 'success',
        message: res.data.message
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.data.message
      })
    }
  })
  .catch(err => {
    // console.log(err);
  })
}

</script>

<style lang="scss" scoped>
:deep(.el-card) {
  min-width: 650px;
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

}
:deep(.el-table) {
  margin-top: 20px;
}
.hero-avatar-box {
  display: flex;
  align-items: center;
  .hero-avatar {
    min-width: 50px;
    max-width: 80px;
  }
}

.option {
  .el-button {
    transition: all .2s;
  }
}

@media screen and (max-width: 1180px) {
  .option {
    display: flex;
    align-items: center;
    flex-direction: column;
    .el-button {
      width: 80%;
    }
    .el-button:last-child {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}
</style>
