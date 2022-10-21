<template>
  <div class="goods-page">
    <el-card>
      <el-button v-permission="['admin']" class="add-goods" :icon="DocumentAdd" type="primary" plain @click="addGoods">添加装备</el-button>
      <el-table
        class="table"
        v-loading="tableLoading"
        border
        empty-text="暂无装备!"
        @sort-change="sortChange"
        :data="goodsList"
        :default-sort="{ prop: 'price', order: 'ascending' }"
      >
        <el-table-column type="expand" label="展开" width="60">
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
        <el-table-column label="名称" prop="name" />
        <el-table-column label="外观">
          <template #default="scope">
            <div class="icon-box">
              <el-image lazy class="item-icon" :src="scope.row.icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" label="价格" prop="price">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div class="option">
              <div>
                <el-button
                  size="small"
                  type="primary"
                  plain
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                >编辑 / 查看</el-button>
              </div>
              <div v-permission="['admin']">
                <el-button
                  size="small"
                  type="danger"
                  plain
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="pageParams.pageNum"
          v-model:page-size="pageParams.pageSize"
          :page-sizes="[10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 装备弹出层 -->
    <el-dialog
      custom-class="add-goods"
      v-model="dialogAddVisible"
      :title="isAddStatus ? '添加装备' : '编辑装备'"
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
            <el-input ref="goodsName" v-model="goodsForm.name" placeholder="请输入装备名!"></el-input>
          </el-form-item>
          <el-form-item label="装备图标">
            <UploadFileVue
              class="hero-avatar"
              :actionUrl="actionUrl"
              :imageUrl="imageUrl"
              @uploadSuccess="uploadSuccess"
            ></UploadFileVue>
          </el-form-item>
          <el-form-item label="评级">
            <el-rate class="rate" :max="3" v-model="goodsForm.star"></el-rate>
          </el-form-item>
          <el-form-item label="价格" class="property-box">
            <el-input class="input-item" v-model="goodsForm.price" placeholder="请输入价格!" />
          </el-form-item>
          <el-form-item label="装备属性" class="property-box">
            <div class="property-item" ref="descItem" v-for="(item, index) in goodsForm.desc" :key="index">
              <el-input class="input-item" v-model="goodsForm.desc[index]" placeholder="请输入属性!">
                <template #suffix>
                  <el-icon @click="deleteProperty(goodsForm.desc, index)"><CloseBold /></el-icon>
                </template>
              </el-input>
            </div>
            <el-button class="add-new-button" type="primary" plain @click="addNewItem(goodsForm.desc, '1')">
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
            <el-button class="add-new-button" type="primary" plain @click="addNewItem(goodsForm.passive, '2')">
              新增被动<el-icon class="el-icon--right"><Plus /></el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer" v-permission="['admin']">
          <el-button plain @click="dialogAddVisible = false">取消</el-button>
          <el-button type="primary" plain @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DocumentAdd, Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus';
import { deepClone } from "@/utils/func";
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
import UploadFileVue from '@/components/UploadFile.vue';
import { commonStore } from "@/store/index";

// 逻辑复用 恢复滚动高度
import {saveScrollH} from '@/utils/saveScroll'
saveScrollH()

const app: any = getCurrentInstance()
const { proxy } = app
const { getGoodsList, createGoods, getGoodsById, updateGoods, deleteGoods } = proxy.$GoodsApi
// 表格加载提示
const tableLoading = ref<boolean>(false)
// 表格数据
let goodsList = ref([])
// 共有多少个商品
let goodsTotal = ref<number>(0)
// 被选中的装备的id
let rowId = ref<string>('')
// 是否显示弹出层
let dialogAddVisible = ref<boolean>(false)
// 是否添加装备
let isAddStatus = ref<boolean>(true)
/**
 * 获取装备列表的参数
 */
interface GetGoods {
  pageNum?: number,
  pageSize?: number,
  orderType?: string
  sortItem?: string
}
// 请求参数
let pageParams: GetGoods = {
  pageNum: 1,
  pageSize: 10,
  orderType: 'ascending',
  sortItem: 'price'
}
interface GoodsForm {
  name: string,
  icon: string,
  star: number,
  price: number | string,
  desc: string[],
  passive: string[]
}
// 编辑/添加装备
let goodsForm = ref<GoodsForm>({
  name: '',
  icon: '',
  star: 0,
  price: '',
  desc: [],
  passive: []
})
// 上传的图片地址
let imageUrl = ref<string>('')

/**
 * 获取 sessionStorage 的 token, 上传 
 */
const token = computed(() => {
  const token = sessionStorage.token
  if (token) {
    return { Authorization: token }
  }
  return {}
})

/**
 * 改变排序
 */
const sortChange = (sortType: any) => {
  pageParams.orderType = sortType.order
  getGoods(pageParams)
}


/**
 * 获取商品
 */
const getGoods = async (params: GetGoods) => {
  tableLoading.value = true
  try {
    const res = await getGoodsList(params)
    goodsTotal.value = res.data.total
    goodsList.value = res.data.data
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


/**
 * 点击编辑
 */
const handleEdit = async (row: any) => {
  dialogAddVisible.value = true
  isAddStatus.value = false
  rowId.value = row._id
  imageUrl.value = row.icon
  goodsForm.value = deepClone(row)
  if (!goodsForm.value.passive.length) {
    goodsForm.value.passive.push('')
  }
  // console.log('点编辑', goodsForm.value);
  await nextTick()
  proxy.$refs.goodsName.focus()
}
/**
 * 点击删除
 */
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该物品吗?',
    '删除物品',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async response => {
    // console.log(response);
    // const res = await $http({
    //   url: `/rest/items/${row._id}`,
    //   method: 'delete'
    // })
    const res = await deleteGoods(row._id)
    // console.log(res);
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`
      })
      getGoods(pageParams)
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

/**
 * 分页的每页条数改变
 */
const handleSizeChange = (val: number) => {
  pageParams.pageSize = val
  getGoods(pageParams)
}
/**
 * 分页的页数改变
 */
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val
  getGoods(pageParams)
}


/**
 * 添加装备
 */
const addGoods = async () => {
  dialogAddVisible.value = true
  isAddStatus.value = true
  imageUrl.value = ''
  goodsForm.value.desc = ['']
  goodsForm.value.passive = ['']
  await nextTick()
  proxy.$refs.goodsName.focus()
  proxy.$refs.dialogScrollbar.scrollTo(0, 0)
}

/**
 * 弹出层关闭
 */
const dialogClosed = () => {
  dialogAddVisible.value = false
  // 不响应式
  // goodsForm.value = {
  //   name: '',
  //   icon: '',
  //   star: 0,
  //   desc: [''],
  //   passive: ['']
  // }
  goodsForm.value.name = ''
  goodsForm.value.icon = ''
  goodsForm.value.star = 0
  goodsForm.value.price = ''
  goodsForm.value.desc = ['']
  goodsForm.value.passive = ['']
  // goodsForm.value.desc.splice(0, goodsForm.value.desc.length)
  // goodsForm.value.desc.push('')
  // goodsForm.value.passive.splice(0, goodsForm.value.passive.length)
  // goodsForm.value.passive.push('')
}

/**
 * 弹出层确定
 */
const confirmAdd = async () => {
  // console.log('表单新数据', goodsForm.value);
  if (isAddStatus.value) {
    // console.log('添加装备');
    try {
      tableLoading.value = true
      // 添加装备
      const res = await createGoods(goodsForm.value)
      if (res.status === 200) {
        ElNotification({
          duration: commonStore().tipDurationS,
          type: 'success',
          message: '添加成功!'
        })
      }
      getGoods(pageParams)
      dialogAddVisible.value = false
    } catch (error) {
      console.log('添加装备失败:', error);      
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'error',
        message: '添加失败!'
      })
    } finally {
      tableLoading.value = false
    }
  } else {
    // console.log('更新装备');
    goodsForm.value.price = Number(goodsForm.value.price)
    const res = await updateGoods(rowId.value, goodsForm.value)
    // console.log(res);
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: '更新成功!'
      })
    }
    dialogAddVisible.value = false
    rowId.value = ''
    getGoods(pageParams)
  }

}


const actionUrl = `${commonStore().uploadPath}items`

const uploadSuccess = (val: string) => {
  imageUrl.value = val
  goodsForm.value.icon = val
}

/**
 * 新增属性
 */
const addNewItem = async (arr: any, type: string) => {
  arr.push('')
  await nextTick()
  proxy.$refs.dialogScrollbar.wrap$.scroll({
    top: proxy.$refs.dialogScrollbar.wrap$.scrollTop + 42,
    behavior: 'smooth'
  })
}

/**
 * 删除
 */
const deleteProperty = (arr: any, index: number) => {
  if (arr.length > 1) {
    arr.splice(index, 1)
  } else {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '至少需有一个!'
    })
  }
}

onMounted(async () => {
  await getGoods(pageParams)

})

</script>
<style lang="scss" scoped>
.goods-page {
  :deep(.el-card) {
    .el-button>span {
      line-height: 1.2;
    }
  }
  .add-goods {
    margin-bottom: 20px;
  }
  .table {
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
        width: 50px;
        height: 50px;
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
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
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
}
</style>
