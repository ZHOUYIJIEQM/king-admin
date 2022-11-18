<template>
  <div class="main-page">
    <!-- 铭文 -->
    <el-card>
      <!-- 顶部搜索 -->
      <el-row style="min-width: 550px;">
        <el-col :span="8">
          <el-input 
            clearable 
            :placeholder="$t('placeholder.inscriptionInput')" 
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
          >{{$t(`btn.addInscription`)}}</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        class="table"
        border
        v-loading="tableLoading"
        :empty-text="emptyText!"
        :data="tableData"
        :default-sort="{ prop: 'grade', order: 'ascending' }"
        @sort-change="sortChange"
      >
        <el-table-column :label="$t(`tableH.name`)" prop="name" />
        <el-table-column :label="$t(`tableH.type`)" prop="type" />
        <el-table-column sortable="custom" :label="$t(`tableH.grade`)" prop="grade" />
        <el-table-column :label="$t(`tableH.image`)" prop="name">
          <template #default="scope">
            <div class="icon-box">
              <el-image lazy class="item-icon" :src="scope.row.img" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="200">
          <template #default="scope">
            <div class="option">
              <div>
                <el-button
                  size="small"
                  type="primary"
                  plain
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                >{{$t(`btn.edit`)}} / {{$t(`btn.view`)}}</el-button>
              </div>
              <div v-permission="['admin']">
                <el-button
                  size="small"
                  type="danger"
                  plain
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                >{{$t(`btn.delete`)}}</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      class="add-goods"
      v-model="dialogVisible"
      :title="isAdd ? '添加装备' : '编辑装备'"
      @close="dialogClosed"
      draggable
    >
      <el-scrollbar 
        class="dialog-scrollbar"
        ref="dialogScrollbar"
        max-height="60vh"
      >
        <el-form 
          class="dialog-from"
          ref="goodsFormEl"
          :model="formData" 
          label-width="80px"
          label-position="left"
        >
        </el-form>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getInscription, createInscription, getInscriptionById, updateInscription, deleteInscription, searchInscriptionByName } from '@/api/inscription'
import { Search, DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { deepClone } from "@/utils/func"
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
// 是否添加 或是更新
const isAdd = ref<boolean>(false)
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
// 请求参数
const searchParams = reactive({
  pageNum: 1,
  pageSize: 10,
  orderType: 'ascending',
  sortItem: 'grade'
})
// 修改排序
const sortChange = async (sortType: any) => {
  searchParams.orderType = sortType.order
  await getTableData(searchParams)
}
// 编辑
const handleEdit = async (row: any) => {}
// 删除
const handleDelete = async (row: any) => {}

// 弹出框
const dialogVisible = ref<boolean>(false)
// 关闭
const dialogClosed = async () => {}
// 表单默认数据
const oFormData = {
  name: '',
  img: '',
  type: "",
  grade: 1,
  desc: [''],
}
const formData = ref<any>(deepClone(oFormData))

// 获取表格数据
const getTableData = async (params) => {
  tableLoading.value = true
  try {
    let res: any = {}
    if (searchQuery.value.length) {
      res = await searchInscriptionByName({ name: searchQuery.value, ...params })
    } else {
      res = await getInscription(params)
    }
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
:deep(.table) {
  margin-top: 20px;
  .icon-box {
    display: flex;
    .item-icon {
      min-width: 45px;
      min-height: 45px;
    }
  }
  .option {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &>div {
      margin-left: 0;
      flex: 1;
      transition: all .3s;
      padding: 5px;
      &>.el-button {
        width: 100%;
      }
    }
  }
}
</style>