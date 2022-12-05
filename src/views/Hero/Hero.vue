<template>
  <TableCard
    showSearch
    v-model:pagination="paginationData"
    v-model:visible="dialogVisible"
    :totalNum="totalNum"
    :btnAdd="$t('btn.addHero')"
    @reloadData="reloadData"
    @addDataItem="addDataItem"
  >
    <template #table>
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        empty-text="暂无英雄!"
        border
        @sort-change="sortChange"
        default-expand-all
      >
        <el-table-column class-name="expand" type="expand" :label="$t(`tableH.expand`)" width="80">
          <template #default="props">
            <div class="hero-detail-box">
              <div class="hero-rate detail-item">
                <div class="title">英雄评估:</div>
                <div class="chart-box">
                  <NightingaleChart :chartOption="getOption(props.row.scores)"></NightingaleChart>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="85px" :label="$t(`tableH.heroName`)" prop="name"></el-table-column>
        <el-table-column align="center" width="110px" class-name='hero-avatar-box' :label="$t(`tableH.avatar`)">
          <template #default="scope">
            <el-image lazy class="hero-avatar" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column min-width="85px" :label="$t(`tableH.heroNickName`)" prop="nickname"></el-table-column>
        <el-table-column min-width="100px" :label="$t(`tableH.category`)" prop="category">
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
import { getHeroList, deleteHero, heroSearch } from "@/api/hero"
import { commonStore } from "@/store/index"
import { permissionStore } from "@/store/permission"

const route = useRoute()
const router = useRouter()
// 图表配置
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
        radius: [10, 60],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 1
        },
        data: seriesData
      }
    ]
  }
  return option
}
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
  router.push({ name: 'heroCreate' })
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
      res = await heroSearch(params)
    } else {
      res = await getHeroList(params)
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
    name: 'heroEdit',
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
    const res = await deleteHero(row._id)
    if (res.status === 200) {
      await getHeroList(queryObj)
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
:deep(td.hero-avatar-box) {
  padding: 0;
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }
  .hero-avatar {
    min-width: 50px;
    aspect-ratio: 1;
    max-width: 80px;
  }
}
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
      height: 210px;
      box-sizing: content-box;
      padding: 15px 0;
      // border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
