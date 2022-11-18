<template>
  <div class="main-page">
    <el-card>
      <!-- 顶部搜索 -->
      <el-row style="min-width: 550px;">
        <el-col :span="8">
          <el-input 
            clearable 
            :placeholder="$t('placeholder.goodsName')" 
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
          >{{$t(`btn.addGoods`)}}</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        class="table"
        border
        v-loading="tableLoading"
        :empty-text="emptyText!"
        :data="tableData"
        :default-sort="{ prop: 'price', order: 'ascending' }"
        @sort-change="sortChange"
      >
        <el-table-column type="expand" :label="$t(`tableH.expand`)" width="80">
          <template #default="props">
            <div class="expand">
              <div class="goods-name">
                <span class="title">名称:</span>
                <span>{{ props.row.name }}</span>
              </div>
              <div class="desc-box" v-if="props.row.desc">
                <span class="title">属性:</span>
                <span class="desc-item" v-for="(item, index) in props.row.desc" :key="index">
                  {{item}} 
                  <span v-if="index<props.row.desc.length - 1">、</span>
                </span>
              </div>
              <div class="passive-box" v-if="props.row.passive.length">
                <p class="passive-item" v-for="(item, index) in props.row.passive" :key="index">
                  <span class="passive-title">{{item.split("：").at(0)}}<span v-if="item.split('：').length > 1">：</span></span>
                  <span>{{item.split("：").slice(1).join('')}}</span>
                </p>
              </div>
              <div class="price-box"><span class="title">总价:</span> {{props.row.price}} 金币</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`tableH.name`)" prop="name" />
        <el-table-column :label="$t(`tableH.appearance`)">
          <template #default="scope">
            <div class="icon-box">
              <el-image lazy class="item-icon" :src="scope.row.icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" :label="$t(`tableH.price`)" prop="price">
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
          :total="totalDataNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      class="add-goods"
      v-model="dialogVisible"
      :title="isAdd ? $t(`btn.addGoods`) : $t(`btn.editGoods`)"
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
          :model="goodsForm" 
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="装备名称">
            <el-input clearable ref="goodsName" v-model="goodsForm.name" placeholder="请输入装备名!"></el-input>
          </el-form-item>
          <el-form-item label="装备图标">
            <UploadFile
              class="hero-avatar"
              :actionUrl="actionUrl"
              :imageUrl="imageUrl"
              @uploadSuccess="uploadSuccess"
            ></UploadFile>
          </el-form-item>
          <el-form-item label="评级">
            <el-rate class="rate" :max="3" v-model="goodsForm.star"></el-rate>
          </el-form-item>
          <el-form-item label="价格" class="property-box">
            <el-input clearable class="input-item" v-model="goodsForm.price" placeholder="请输入价格!" />
          </el-form-item>
          <el-form-item label="装备属性" class="property-box">
            <div class="property-item" ref="descItem" v-for="(item, index) in goodsForm.desc" :key="index">
              <el-input class="input-item" v-model="goodsForm.desc[index]" placeholder="请输入属性!">
                <template #suffix>
                  <el-icon @click="deleteProperty(goodsForm.desc, index)"><CloseBold /></el-icon>
                </template>
              </el-input>
            </div>
            <el-button class="add-new-button" type="primary" plain @click="addNewItem(goodsForm.desc)">
              新增属性<el-icon class="el-icon--right"><Plus /></el-icon>
            </el-button>
          </el-form-item>
          <el-form-item label="装备被动" class="property-box">
            <div class="property-item" ref="passiveItem" v-for="(item, index) in goodsForm.passive" :key="index">
              <el-input class="input-item" v-model="goodsForm.passive[index]" placeholder="请输入被动!">
                <template #suffix>
                  <el-icon @click="deleteProperty(goodsForm.passive, index)"><CloseBold /></el-icon>
                </template>
              </el-input>
            </div>
            <el-button class="add-new-button" type="primary" plain @click="addNewItem(goodsForm.passive)">
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
import { Search, DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { deepClone } from "@/utils/func"
import { commonStore } from "@/store/index"
import { saveScrollH } from '@/utils/saveScroll'
// 保存/恢复滚动高度
saveScrollH();

// 请求装备列表的参数接口
interface GetGoodsParams {
  pageNum?: number
  pageSize?: number
  orderType?: string
  sortItem?: string
}
const app: any = getCurrentInstance()
const { proxy } = app
// 请求接口
const { getGoodsList, createGoods, getGoodsById, updateGoods, deleteGoods, getGoodsByName } = proxy.$GoodsApi
// 搜索词
const searchQuery = ref<string>('')
// 表格空白提示
const emptyText = "暂无装备!"
// 表格数据
const tableData = ref<any []>([])
// 共有多少条数据
const totalDataNum = ref<number>(0)
// 表格是否加载中
const tableLoading = ref<boolean>(true)
// 请求参数
const searchParams: GetGoodsParams = reactive({
  pageNum: 1,
  pageSize: 10,
  orderType: 'ascending',
  sortItem: 'price'
})
// 上传的图片地址
const imageUrl = ref<string>('')
// 是否显示弹出层
const dialogVisible = ref<boolean>(false)
// 是否添加 或是更新
const isAdd = ref<boolean>(false)
// 被选中的装备的id
const rowId = ref<string>('')
// 弹出层表单绑定数据
const oGoodsForm: any = {
  name: '',
  icon: '',
  star: 0,
  price: '',
  desc: [''],
  passive: ['']
}
const goodsForm = ref<any>(deepClone(oGoodsForm))
// 搜索请求定时器
let timer: null | number = null
// 记录搜索前的页数
let lastPageNum: number = 0
// 上传接口
const actionUrl = computed<string>(() => {
  return `${commonStore().uploadPath}/items`
})

// 处理搜索
const handleSearch = async () => {
  await getTableData(searchParams)
}
// 表格数据排序
const sortChange = async (sortType: any) => {
  searchParams.orderType = sortType.order
  await getTableData(searchParams)
}
// 点击添加
const addData = async () => {
  isAdd.value = true
  dialogVisible.value = true
  imageUrl.value = ''
  goodsForm.value = deepClone(oGoodsForm)
  // console.log(proxy.$refs.goodsName);
  // nextTick 没效
  // await nextTick()
  // console.log(proxy.$refs.goodsName);
  setTimeout(() => {
    proxy.$refs.goodsName.focus()
    proxy.$refs.dialogScrollbar.scrollTo(0, 0)
  }, 100);
}
// 获取表格数据
const getTableData = async (params: GetGoodsParams) => {
  tableLoading.value = true
  try {
    let res: any = {}
    if (searchQuery.value.length) {
      res = await getGoodsByName({name: searchQuery.value, ...params})
    } else {
      res = await getGoodsList(params)
    }
    tableData.value = res?.data.data
    totalDataNum.value = res?.data.total
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
// 点击编辑
const handleEdit = async (row: any) => {
  goodsForm.value = deepClone(row)
  rowId.value = row._id
  imageUrl.value = row.icon
  isAdd.value = false
  dialogVisible.value = true
  setTimeout(() => {
    proxy.$refs.goodsName.focus()
    proxy.$refs.dialogScrollbar.scrollTo(0, 0)
  }, 100);
}
// 点击删除
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该物品吗?',
    '删除物品',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async response => {
    const res = await deleteGoods(row._id)
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
// 弹出框关闭
const dialogClosed = async () => {
}
// 上传成功
const uploadSuccess = (val: string) => {
  imageUrl.value = val
  goodsForm.value.icon = val
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
// 新增属性
const addNewItem = async (arr: any) => {
  arr.push('')
  // await nextTick()
  setTimeout(() => {
    proxy.$refs.dialogScrollbar.wrap$.scroll({
      top: proxy.$refs.dialogScrollbar.wrap$.scrollTop + 42,
      behavior: 'smooth'
    })
  }, 50)
}
// 弹出框点保存
const confirmAdd = async () => {
  tableLoading.value = true
  if (isAdd.value) {
    const res = await createGoods(goodsForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: res.data.message
      })
    }
  } else {
    const res = await updateGoods(rowId.value, goodsForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: res.data.message
      })
    }
  }

  dialogVisible.value = false
  tableLoading.value = false
  rowId.value = ""
  await getTableData(searchParams)
}

watch(
  searchQuery,
  (newV, oldV) => {
    // 记录输入搜索词前已跳转的页数, 等删除搜索词后回到原页数
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
)

onMounted(async () => {
  await getTableData(searchParams)
})
</script>
<style lang="scss" scoped>
:deep(.table) {
  margin-top: 20px;
  .expand {
    padding: 5px 15px;
    &>div {
      margin-bottom: 10px;
      .title, .passive-title {
        font-weight: bold;
        font-size: 15px;
        margin-right: 8px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .desc-box {
      line-height: 1.4;
      .desc-item {
        // margin-right: 5px;
      }
    }
    .passive-box {
      .passive-item {
        margin-bottom: 6px;
        line-height: 1.4;
        .passive-title {
          margin-right: 0;
        }
      }
    }
    .price-box {
      .title {
        margin-right: 3px;
      }
    }
  }
  .icon-box {
    display: flex;
    .item-icon {
      width: 65px;
      height: 65px;
      img {
        object-fit: contain;
      }
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
:deep(.el-overlay-dialog) {
  display: flex;
  justify-content: center;
  align-items: center;
  $pdl: 20px;
  .el-dialog__header {
    padding: 12px $pdl;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    padding: $pdl;
  }
  .dialog-scrollbar {
    padding: 0 $pdl;
    .el-scrollbar__wrap {
      // max-height: 60vh;
      padding: $pdl 0;
    }
  }
  // .dialog-from {
  //   margin: $pdl 0;
  // }
  button.el-dialog__headerbtn {
    width: 40px;
    height: 40px;
  }
  .add-goods {
    margin: 0;
    max-width: 550px;
    min-width: 350px;
    .avatar-uploader {
      $avatarWidth: 100px;
      .avatar {
        width: $avatarWidth;
      }
      .el-upload {
        box-sizing: border-box;
        width: $avatarWidth;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: $avatarWidth;
        height: $avatarWidth;
        text-align: center;
      }
    } 
    .rate {
      line-height: 1;
    }
    .el-form {
      &>.el-form-item {
        &.property-box {
          margin-bottom: 20px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .property-box {
      .property-item {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .input-item {
          flex: 1;
          input {
            text-overflow: ellipsis;
          }
        }
        .el-icon {
          cursor: pointer;
          flex-shrink: 0;
          margin-left: 15px;
        }
      }
      .add-new-button {
        // width: 100%;
        display: flex;
        line-height: 1.5;
        align-items: center;
      }
    }
  }
}
</style>