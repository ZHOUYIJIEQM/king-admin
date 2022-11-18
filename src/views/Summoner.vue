<template>
  <div class="main-page">
    <el-card>
      <el-row style="min-width: 630px;">
        <el-col :span="8">
          <el-input clearable :placeholder="$t('placeholder.summonerInput')" v-model="searchQuery" @keyup.enter="handleSearch"></el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" plain :icon="Search" style="margin-left: 15px;" @click="handleSearch">{{$t(`btn.search`)}}</el-button>
          <el-button v-permission="['admin']" type="primary" plain :icon="DocumentAdd" style="margin-left: 15px;" @click="addData">{{$t(`btn.addSummoner`)}}</el-button>
        </el-col>
      </el-row>
      <el-table
        class="table"
        border
        v-loading="tableLoading"
        :empty-text="emptyText!"
        :data="tableData"
        :default-sort="{ prop: 'rank', order: 'ascending' }"
        @sort-change="sortChange"
      >
        <el-table-column width="80px" :label="$t(`tableH.name`)" prop="name" />
        <el-table-column width="90px" sortable="custom" :label="$t(`tableH.grade`)" prop="rank" />
        <el-table-column width="90px" :label="$t(`tableH.image`)" prop="img">
          <template #default="scope">
            <div class="icon-box">
              <el-image lazy class="item-icon" :src="scope.row.img" />
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="250px" :label="$t(`tableH.desc`)" prop="description">
          <template #default="scope">
            <div>
              <span style="font-weight: bold;">{{scope.row.description.split('CD：').at(0)}}CD：</span>
              <span>{{scope.row.description.split('CD：').slice(1).join('')}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="150">
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
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="searchParams.pageNum"
          v-model:page-size="searchParams.pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          small
          :total="totalDataNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isAdd ? $t(`btn.addSummoner`) : $t(`btn.editSummoner`)"
      draggable
    >
      <el-scrollbar 
        class="dialog-scrollbar"
        ref="dialogScrollbar"
        max-height="50vh"
      >
        <el-form
          class="dialog-from"
          :model="formData" 
          label-width="80px"
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
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer" v-permission="['admin']">
          <el-button plain @click="dialogVisible = false">{{$t(`btn.cancel`)}}</el-button>
          <el-button type="primary" plain @click="confirmAdd">{{$t(`btn.confirm`)}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getSummoner, createSummoner, updateSummoner, deleteSummoner, searchSummonerByName } from '@/api/summoner'
import { Search, DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import { saveScrollH } from '@/utils/saveScroll'
// 保存/恢复滚动高度
saveScrollH();

const app: any = getCurrentInstance()
const { proxy } = app
const searchQuery = ref<string>('')
const searchParams = reactive({
  pageNum: 1,
  pageSize: 5,
  orderType: 'ascending',
  sortItem: 'rank'
})
// 表格数据
const tableData = ref<any []>([])
// 表格空白提示
const emptyText = "暂无技能!"
// 共有多少条数据
const totalDataNum = ref<number>(0)
// 表格是否加载中
const tableLoading = ref<boolean>(true)
// 搜索请求定时器
let timer: null | number = null
// 记录搜索前的页数
let lastPageNum: number = 0
// 搜索词变化处理函数
const watchSearchQuery = async (newV, oldV) => {
  !lastPageNum && (lastPageNum = searchParams.pageNum || 1)
  // 恢复页数
  if (oldV.length && !newV.length) {
    searchParams.pageNum = lastPageNum
    lastPageNum = 0
  }
  // 防抖
  timer && clearTimeout(timer)
  timer = setTimeout(async () => {
    // 有搜索词时, 每次触发搜索函数, 页数跳回第一页
    lastPageNum && (searchParams.pageNum = 1)
    await getTableData(searchParams);
  }, 500)
}
// 监听搜索词变化
watch(searchQuery, watchSearchQuery)
// 弹出框
const dialogVisible = ref<boolean>(false)
// 表单默认数据
const oFormData = {
  name: '',
  rank: 1,
  img: '',
  description: '',
}
const formData = ref<any>(Object.assign({}, oFormData))
// 上传接口
const actionUrl = computed<string>(() => {
  return `${commonStore().uploadPath}/inscription`
})
const imageUrl = ref<string>('')
const isAdd = ref<boolean>(false)

// 搜索函数
const handleSearch = async () => {}
// 添加数据
const addData = async () => {
  dialogVisible.value = true
  isAdd.value = true
  imageUrl.value = ''
  formData.value = Object.assign({}, oFormData)
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 50)
}
// 编辑
const handleEdit = async (row: any) => {
  dialogVisible.value = true
  isAdd.value = false
  imageUrl.value = row.img
  formData.value = Object.assign({}, row)
  await nextTick()
  // note: 有坑, 在 nextTick 后 el-input 没有获取焦点, 但用setTimeout可以。不加 nextTick, 只用 setTimeout 获取焦点时, 光标出现在字符串第一位
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 50)
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
      await getTableData(searchParams)
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
// 上传成功
const uploadSuccess = (val: string) => {
  imageUrl.value = val
  formData.value.img = val
}
// 每页数量改变
const handleSizeChange = async (size: number) => {
  searchParams.pageSize = size
  await getTableData(searchParams)
}
// 页数切换
const handleCurrentChange = async (current: number) => {
  searchParams.pageNum = current
  await getTableData(searchParams)
}
// 修改排序
const sortChange = async (sortType: any) => {
  searchParams.orderType = sortType.order
  await getTableData(searchParams)
}
// 保存
const confirmAdd = async () => {
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
  tableLoading.value = false
  await getTableData(searchParams)
}

// 获取数据
const getTableData = async (params) => {
  tableLoading.value = true
  try {
    let res: any = {}
    if (searchQuery.value.length) {
      res = await searchSummonerByName({ name: searchQuery.value, ...params })
    } else {
      res = await getSummoner(params)
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
  margin: 20px auto;
  .item-icon {
    border-radius: 50%;
    width: 50px;
    aspect-ratio: 1;
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
:deep(.icon-upload) {
  .el-upload {
    width: 50px !important;
    max-height: 60px !important;
    min-height: 50px !important;
  }
}
</style>