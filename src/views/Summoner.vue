<template>
  <div class="main-page">
  <!-- 召唤师技能 -->
    <el-card>
      <!-- 顶部搜索 -->
      <el-row style="min-width: 630px;">
        <el-col :span="8">
          <el-input 
            clearable 
            :placeholder="$t('placeholder.summonerInput')" 
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
          >{{$t(`btn.addSummoner`)}}</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getInscription, createInscription, getInscriptionById } from '@/api/inscription'
import { Search, DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import { saveScrollH } from '@/utils/saveScroll'
// 保存/恢复滚动高度
saveScrollH();

// 搜索词
const searchQuery = ref<string>('')
// 处理搜索
const handleSearch = async () => {}
// 搜索词变化处理函数
const watchSearchQuery = async (newV, oldV) => {
  console.log(newV, '--', oldV);
}
// 监听搜索词变化
watch(searchQuery, watchSearchQuery)
// 点击添加
const addData = async () => {}

// 表格数据
const tableData = ref<any []>([])
// 表格空白提示
const emptyText = "暂无装备!"
// 共有多少条数据
const totalDataNum = ref<number>(0)
// 表格是否加载中
const tableLoading = ref<boolean>(true)
const searchParams = reactive({
  pageNum: 1,
  pageSize: 10,
  // orderType: 'ascending',
  // sortItem: 'price'
})
// 获取表格数据
const getTableData = async (params) => {
  tableLoading.value = true
  try {
    const res = await getInscription(params)
    tableData.value = res.data.data
    totalDataNum.value = res.data.total
  } catch (error) {
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'error',
      message: '获取装备失败!'
    })
  } finally {
    setTimeout(() => {
      tableLoading.value = false
    }, 300)
  }
}

onMounted(async () => {
  await getTableData(searchParams)
})
</script>
<style lang="scss" scoped>

</style>