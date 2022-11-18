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
        <el-table-column type="expand" :label="$t(`tableH.expand`)" width="80">
          <template #default="props">
            <div class="expand">
              <div style="font-weight: bold;">铭文说明:</div>
              <div v-for="(item, index) in props.row.desc" :key="index">
                {{item}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.name`)" prop="name" />
        <el-table-column :label="$t(`tableH.type`)" prop="type" />
        <!-- <el-table-column :label="$t(`tableH.type`)" prop="type">
          <template #default="scope">
            <span :style="{ display: 'inline-block', padding: '5px', color: 'black', background: scope.row.type }">{{scope.row.type}}</span>
          </template>
        </el-table-column> -->
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
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="searchParams.pageNum"
          v-model:page-size="searchParams.pageSize"
          :page-sizes="[10, 20, 30]"
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
      :title="isAdd ? $t(`btn.addInscription`) : $t(`btn.editInscription`)"
      @close="dialogClosed"
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
          <el-form-item label="铭文名称">
            <el-input clearable ref="nameEl" v-model="formData.name" placeholder="请输入铭文名称!"></el-input>
          </el-form-item>
          <el-form-item label="铭文图标">
            <UploadFile
              class="icon-upload"
              :actionUrl="actionUrl"
              :imageUrl="imageUrl"
              @uploadSuccess="uploadSuccess"
            ></UploadFile>
          </el-form-item>
          <el-form-item label="铭文等级">
            <el-rate class="rate" :max="5" v-model="formData.grade"></el-rate>
          </el-form-item>
          <el-form-item label="铭文类型">
            <el-select v-model="formData.type" placeholder="选择类型">
              <el-option
                v-for="item in ['yellow', 'red', 'blue']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="铭文说明">
            <div class="property-item" ref="passiveItem" v-for="(item, index) in formData.desc" :key="index">
              <el-input class="input-item" v-model="formData.desc[index]" placeholder="请输入被动!">
                <template #suffix>
                  <el-icon @click="deleteProperty(formData.desc, index)"><CloseBold /></el-icon>
                </template>
              </el-input>
            </div>
            <el-button class="add-new-button" type="primary" plain @click="addNewItem(formData.desc)">
              新增被动<el-icon class="el-icon--right"><Plus /></el-icon>
            </el-button>
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
import { getInscription, createInscription, getInscriptionById, updateInscription, deleteInscription, searchInscriptionByName } from '@/api/inscription'
import { Search, DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { deepClone } from "@/utils/func"
import { commonStore } from "@/store/index"
import { saveScrollH } from '@/utils/saveScroll'
// 保存/恢复滚动高度
saveScrollH();

const app: any = getCurrentInstance()
const { proxy } = app
// 搜索词
const searchQuery = ref<string>('')
// 处理搜索
const handleSearch = async () => {
  await getTableData(searchParams)
}
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
// 是否添加 或是更新
const isAdd = ref<boolean>(false)
// 点击添加
const addData = async () => {
  dialogVisible.value = true
  isAdd.value = true
  formData.value = deepClone(oFormData)
  imageUrl.value = ''
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 50)
}

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
const handleEdit = async (row: any) => {
  dialogVisible.value = true
  isAdd.value = false
  imageUrl.value = row.img
  formData.value = deepClone(row)
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
    const res = await deleteInscription(row._id)
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
// 每页数量改变
const handleSizeChange = async (size: number) => {
  searchParams.pageNum = size
  await getTableData(searchParams)
}
// 页数切换
const handleCurrentChange = async (current: number) => {
  searchParams.pageNum = current
  await getTableData(searchParams)
}

// 弹出框
const dialogVisible = ref<boolean>(false)
// 关闭
const dialogClosed = async () => {}
// 表单默认数据
const oFormData = {
  name: '',
  img: '',
  type: "",
  grade: 0,
  desc: [''],
}
const formData = ref<any>(deepClone(oFormData))
// 上传接口
const actionUrl = computed<string>(() => {
  return `${commonStore().uploadPath}/inscription`
})
const imageUrl = ref<string>('')
// 上传成功
const uploadSuccess = (val: string) => {
  imageUrl.value = val
  formData.value.img = val
}
// 新增属性
const addNewItem = async (arr: any) => {
  arr.push('')
  // await nextTick()
  setTimeout(() => {
    proxy.$refs.dialogScrollbar.wrap$.scroll({
      top: proxy.$refs.dialogScrollbar.wrap$.scrollTop + 50,
      behavior: 'smooth'
    })
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
// 保存
const confirmAdd = async () => {
  tableLoading.value = true
  let res: any = {}
  if (isAdd.value) {
    res = await createInscription(formData.value)
  } else {
    res = await updateInscription(formData.value._id, formData.value)
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
  margin: 20px auto;
  .expand {
    padding: 0 15px;
    div {
      line-height: 1.8;
    }
  }
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
:deep(.el-dialog) {
  .el-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-dialog__footer {
    padding-top: 0;
  }
  .property-item {
    width: 100%;
    margin-bottom: 15px;
  }
  .add-new-button {
    display: flex;
    line-height: 1.5;
    align-items: center;
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