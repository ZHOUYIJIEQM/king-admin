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
            v-permission="['admin']"
            type="primary" 
            plain
            :icon="DocumentAdd" 
            style="margin-left: 15px;"
            @click="addHero"
          >添加新英雄</el-button>
        </el-col>
      </el-row>
      <el-table 
        :data="heroList"
        v-loading="isLoading"
        empty-text="暂无英雄数据!"
        border
        stripe
      >
        <el-table-column type="expand" label="展开" width="60">
          <template #default="props">
            <div class="hero-detail-box">
              <div class="hero-rate detail-item">
                <div class="title">英雄评估:</div>
                <div class="chart-box">
                  <NightingaleChart :chartOption="getOption(props.row.scores)"></NightingaleChart>
                </div>
              </div>
              <!-- <div class="skills-box detail-item">
                <div class="title">查看技能:</div>
                <div class="skill-item" v-for="item in props.row.skills" :key="item._id">
                  <div class="left">
                    <el-image class="skill-icon" :src="item.icon" />
                  </div>
                  <div class="right">
                    <h3>{{item.name}}</h3>
                    <p>{{item.desc}}</p>
                  </div>
                </div>
              </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="英雄名称" prop="name"></el-table-column>
        <el-table-column label="英雄称号" prop="nickname"></el-table-column>
        <el-table-column label="所属分类">
          <template #default="scope">
            <span>{{category(scope.row.cate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像">
          <template #default="scope">
            <div class="hero-avatar-box">
              <el-image lazy class="hero-avatar" :src="scope.row.avatar" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
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
                v-permission="['admin']"
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
          v-model:currentPage="pageParams.pageNum"
          v-model:page-size="pageParams.pageSize"
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
import loading from '@/utils/loading'
import { getCurrentInstance, ref, onMounted } from 'vue';
import { DocumentAdd, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import NightingaleChart from '@/components/NightingaleChart.vue'
import { commonStore } from "@/store/index"
import {saveScrollH} from '@/utils/saveScroll'
saveScrollH()

const router = useRouter()
const app: any = getCurrentInstance()
const { getHeroList, deleteHero, heroSearch } = app?.proxy.$HeroApi

const category = (data:any) => {
  return data.map((item:any) => item.name).join('/')
}

const getOption = (obj: any) => {
  // obj = { difficulty: 3, skill: 4, attack: 3, survive: 10 };
  let cn = { skill: '技能', attack: '攻击', survive: '生存', difficulty: '难度', }
  let seriesData = Object.keys(obj).map(i => {
    return { value: Number(obj[i]), name: cn[i] }
  })
  // console.log(obj);
  let option = {
    title: {
      text: '英雄评估',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
      left: 'center',
      top: 'bottom',
      data: seriesData.map(i => i.name)
    },
    series: [
      {
        name: '英雄评估',
        type: 'pie',
        radius: [15, 60],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 2
        },
        data: seriesData
      }
    ]
  }
  return option
}

// input 查询词
const heroQuery = ref<string>('')
// 英雄列表
let heroList = ref([])
let total = ref(0)
// 请求页参数
interface GetGoods {
  pageNum: number,
  pageSize: number,
}
let pageParams: GetGoods = {
  pageNum: 1,
  pageSize: 10,
}
// 加载提示
let isLoading = ref<boolean>(false)
// 获取英雄列表
const getHeroData = async () => {
  isLoading.value = true
  try {
    let res = await getHeroList(pageParams)
    // console.log(res.data.data);
    if (res.status === 200) {
      heroList.value = res.data.data
      total.value = res.data.total
    }
  } catch (error) {
    console.log(error);
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'error',
      message: '获取英雄列表出错!'
    })
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}

// 每页条数改变
const handleSizeChange = (val: number) => {
  pageParams.pageSize = val
  getHeroData()
}
// 页数改变
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val
  getHeroData()
}
// 搜索
const searchHero = async (event:any) => {
  event.target.blur()
  pageParams.pageNum = 1
  // todo: 根据名称搜索英雄
  // console.log(heroQuery.value);
  try {
    // loading.openLoading()
    let res = await heroSearch({name: heroQuery.value})
    // console.log(res.data);
    heroList.value = res.data
  } catch (error) {
    console.log(error);
  } finally {
    // loading.closeLoading()
  }
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
    // console.log(response);
    const res = await deleteHero(row._id)
    if (res.status === 200) {
      getHeroData()
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`,
      })
    } else {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'error',
        message: res.data.message,
      })
    }
  })
  .catch(err => {
    // console.log(err);
  })
}

onMounted(async() => {
  try {
    // loading.openLoading()
    await getHeroData()
  } catch (error) {
    console.log(error);
  } finally {
    // loading.closeLoading()
  }
})

</script>

<style lang="scss" scoped>
.hero-detail-box {
  padding: 15px 0 0;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .detail-item {
    padding: 0 15px;
  }
  .hero-rate {
    .chart-box {
      height: 200px;
      box-sizing: content-box;
      padding: 15px 0;
      // border-bottom: 1px solid #ebeef5;
    }
  }
  .skills-box {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-top: 15px;
    .skill-item {
      display: flex;
      // align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #ebeef5;
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: 0;
      }
      .left {
        .skill-icon {
          border-radius: 50%;
          width: 60px;
          aspect-ratio: 1;
        }
        margin-right: 15px;
      }
      .right {
        h3 {
          font-size: 14px;
          margin-bottom: 8px;
        }
        p {
          font-size: 13px;
          line-height: 1.4;
        }
      }
    }
  }
}

:deep(.el-table__cell.el-table__expanded-cell) {
  padding: 0;
}

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
    aspect-ratio: 1;
    max-width: 80px;
  }
}

.option {
  display: flex;
  flex-wrap: wrap;
  .el-button {
    width: 100%;
    margin-left: 0;
    &:nth-child(2){
      margin-top: 10px;
    }
    // transition: all .2s;
  }
}

@media screen and (max-width: 1180px) {
  // .option {
  //   display: flex;
  //   align-items: center;
  //   flex-direction: column;
  //   .el-button {
  //     width: 80%;
  //   }
  //   .el-button:last-child {
  //     margin-left: 0;
  //     margin-top: 10px;
  //   }
  // }
}
</style>
