<template>
  <TableCard
    ref="TableCardEl"
    showSearch
    v-model:pagination="paginationData"
    v-model:visible="dialogVisible"
    :isAdd="isAdd"
    :totalNum="totalNum"
    :btnAdd="$t('btn.addGoods')"
    :dialogTitle="isAdd ? $t('btn.addGoods') : $t('btn.editGoods')"
    @reloadData="reloadData"
    @addDataItem="addDataItem"
    @saveContent="saveContent"
  >
    <template #table>
      <el-table
        class="table"
        border
        v-loading="tableLoading"
        empty-text="暂无装备!"
        :data="tableData"
        :default-sort="{ prop: 'price', order: 'ascending' }"
        @sort-change="sortChange"
      >
        <el-table-column class-name="expand" type="expand" :label="$t(`tableH.expand`)" width="85">
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
        <el-table-column class-name="goods-img-box" :label="$t(`tableH.appearance`)">
          <template #default="scope">
            <el-image lazy class="goods-img" :src="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column sortable="custom" :label="$t(`tableH.price`)" prop="price">
        </el-table-column>
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="200">
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
                :style="{ 'margin-top': permissionStore().valueHasPermission(['admin']) ? '10px' : '' }"
                v-permission="['admin']"
                size="small"
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
    <template #dialog>
      <el-form 
        class="dialog-from"
        :model="formData" 
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="装备名称">
          <el-input clearable ref="nameEl" v-model="formData.name" placeholder="请输入装备名!"></el-input>
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
          <el-rate class="rate" :max="3" v-model="formData.star"></el-rate>
        </el-form-item>
        <el-form-item label="价格" class="property-box">
          <el-input clearable class="input-item" v-model="formData.price" placeholder="请输入价格!" />
        </el-form-item>
        <el-form-item label="装备属性" class="property-box">
          <div class="property-item" ref="descItem" v-for="(item, index) in formData.desc" :key="index">
            <el-input class="input-item" v-model="formData.desc[index]" placeholder="请输入属性!">
              <template #suffix>
                <el-icon @click="deleteProperty(formData.desc, index)"><CloseBold /></el-icon>
              </template>
            </el-input>
          </div>
          <el-button class="add-new-button" type="primary" plain @click="addNewItem(formData.desc)">
            新增属性<el-icon class="el-icon--right"><Plus /></el-icon>
          </el-button>
        </el-form-item>
        <el-form-item label="装备被动" class="property-box">
          <div class="property-item" ref="passiveItem" v-for="(item, index) in formData.passive" :key="index">
            <el-input class="input-item" v-model="formData.passive[index]" placeholder="请输入被动!">
              <template #suffix>
                <el-icon @click="deleteProperty(formData.passive, index)"><CloseBold /></el-icon>
              </template>
            </el-input>
          </div>
          <el-button class="add-new-button" type="primary" plain @click="addNewItem(formData.passive)">
            新增被动<el-icon class="el-icon--right"><Plus /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </TableCard>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus, CloseBold } from '@element-plus/icons-vue'
import { getGoodsList, createGoods, updateGoods, deleteGoods, getGoodsByName } from '@/api/goods'
import { commonStore } from '@/store/index'
import { permissionStore } from '@/store/permission'

const TableCardEl = ref<any>()
const { proxy: { $lodash } }: any = getCurrentInstance()
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
// 是否添加
const isAdd = ref<boolean>(false)
// 表格数据
const tableData = ref<any []>([])
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
  sortItem: 'price',
  orderType: 'ascending'
}
// 表单数据
const formData = ref<any>({})
// 上传的图片地址
const imageUrl = ref<string>('')
// 上传接口
const actionUrl = computed<string>(() => {
  return `${commonStore().uploadPath}/items`
})
// 上传成功
const uploadSuccess = (val: string) => {
  imageUrl.value = val
  formData.value.icon = val
}
// 点击编辑
const handleEdit = async (row: any) => {
  isAdd.value = false
  dialogVisible.value = true
  imageUrl.value = row.icon
  formData.value = $lodash.cloneDeep(row)
}
// 点击删除
const handleDelete = async (row: any) => {
  ElMessageBox.confirm( '确定要删除该装备吗?', '删除装备',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async response => {
    const res = await deleteGoods(row._id)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: `${row.name} ${res.data.message}`
      })
      await getTableData(queryObj)
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
// 获取表格数据
const getTableData = async (params: any) => {
  try {
    tableLoading.value = true
    let res: any = {}
    // console.log('请求参数', params);
    // 存在搜索名称, 使用搜索接口
    if (params?.name) {
      res = await getGoodsByName(params)
    } else {
      res = await getGoodsList(params)
    }
    // console.log(res.data);
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
// 更新
const reloadData = async (queryParams: any) => {
  queryObj = Object.assign({}, queryObj, queryParams)
  await getTableData(queryObj)
}
// 点击添加
const addDataItem = async (val: any) => {
  isAdd.value = true
  dialogVisible.value = true
  imageUrl.value = ''
  formData.value = {
    passive: [""],
    desc: [""]
  }
  // setTimeout(() => {
    await nextTick()
    TableCardEl.value.dialogScrollbarEl.scrollTo({
      top: 0
    })
  // }, 0)
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
    TableCardEl.value.dialogScrollbarEl.scrollTo({
      top: TableCardEl.value.dialogScrollbarEl.wrap$.scrollTop + 50,
      behavior: 'smooth'
    })
  }, 100)
}
// 保存
const saveContent = async () => {
  try {
    tableLoading.value = true
    let res: any = {}
    if (isAdd.value) {
      res = await createGoods(formData.value)
    } else {
      res = await updateGoods(formData.value._id, formData.value)
    }
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: res.data.message
      })
    }
    dialogVisible.value = false
    await getTableData(queryObj)
  } catch (error: any) {
    console.log(error);
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'success',
      message: error.message
    })
  } finally {
    tableLoading.value = false
  }
}
// 排序
const sortChange = async (sortType: any) => {
  queryObj.orderType = sortType.order
  await getTableData(queryObj)
}

onMounted(async () => {
  await getTableData(queryObj)
})
</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';
:deep(.el-table) {
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
  td.goods-img-box {
    padding: 0;
    .cell {
      display: flex;
      align-items: center;
      padding: 15px;
    }
  }
}
:deep(.el-form) {
  .el-upload {
    width: 120px !important;
    max-height: 120px !important;
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
</style>