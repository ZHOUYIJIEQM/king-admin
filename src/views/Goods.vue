<template>
  <div class="goods-page">
    <el-card>
      <el-button type="primary" @click="addGoods">添加装备</el-button>
      <el-table
        class="table"
        v-loading="isLoading"
        :data="goodsList"
        border
      >
        <el-table-column type="expand" label="展开" width="60">
          <template #default="props">
            <div class="expand">
              <p><span>名称:</span> {{ props.row.name }}</p>
              <p><span>描述:</span> {{ props.row.desc }}</p>
              <p v-if="props.row.detail.length"><span>详情:</span> {{ props.row.detail }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="外观">
          <template #default="scope">
            <div class="icon-box">
              <img class="item-icon" :src="scope.row.icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评级" prop="star" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="pageParams.pagenum"
          v-model:page-size="pageParams.pagesize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加装备 -->
    <el-dialog 
      custom-class="add-goods" 
      v-model="dialogAddVisible"
      :title="isAddStatus ? '添加装备' : '编辑装备'"
      @closed="dialogClosed"
    >
      <el-form 
        ref="goodsFormEl"
        :model="addGoodsForm" 
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="物品名称">
          <el-input ref="goodsName" v-model="addGoodsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物品图标">
          <el-upload
            class="avatar-uploader"
            :action="actionUrl"
            :headers="token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="评级">
          <el-rate class="rate" :max="3" v-model="addGoodsForm.star"></el-rate>
        </el-form-item>
        <el-form-item label="物品简介">
          <el-input v-model="addGoodsForm.desc" />
        </el-form-item>
        <el-form-item label="物品详情">
          <el-input v-model="addGoodsForm.detail" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps } from 'element-plus'
import { computed, getCurrentInstance, nextTick, reactive, ref } from 'vue';

const app = getCurrentInstance()
const $http = app?.appContext.config.globalProperties.$http
const token = computed(() => {
  const token = sessionStorage.token
  if (token) {
    return {
      Authorization: token
    }
  }
  return {}
})

let isLoading = ref<boolean>(false)
let rowId = ref('')

// 获取物品
interface GetGoods {
  pagenum: number,
  pagesize: number,
}
let pageParams: GetGoods = {
  pagenum: 1,
  pagesize: 5
}
let goodsList = ref([])
let goodsTotal = ref<number>(0)
const getGoods = async (params: GetGoods) => {
  isLoading.value = true
  try {
    const res = await $http({
      url: '/rest/items',
      params
    })
    if (res?.status === 200) {
      // console.log(res.data.data);
      goodsTotal.value = res.data.total
      goodsList.value = res.data.data
    } else {
      ElMessage({
        type: 'error',
        message: '获取物品失败!'
      })
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取物品失败!'
    })
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}
getGoods(pageParams)

// 添加装备
let isAddStatus = ref<boolean>(true)
let dialogAddVisible = ref<boolean>(false)
// 按钮 添加装备
const addGoods = async () => {
  dialogAddVisible.value = true
  isAddStatus.value = true
  imageUrl.value = ''
  await nextTick()
  app?.ctx.$refs.goodsName.focus()
}
interface GoodsForm {
  name: string,
  icon: string,
  star: number,
  desc: string,
  detail: string
}
let addGoodsForm = ref<GoodsForm>({
  name: '',
  icon: '',
  star: 0,
  desc: '',
  detail: ''
})
// 确认添加
const confirmAdd = async () => {
  if (isAddStatus.value) {
    console.log('添加装备');
    try {
      isLoading.value = true
      // 添加装备
      const res = await $http({
        url: '/rest/items',
        method: 'post',
        data: addGoodsForm.value
      })
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '添加成功'
        })
      } else {
        ElMessage({
          type: 'error',
          message: '添加失败'
        })
      }
      getGoods(pageParams)
      dialogAddVisible.value = false
    } catch (error) {
      console.log('添加装备失败:', error);      
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('更新装备');
    // console.log(addGoodsForm.value);
    let res = await $http({
      url: `/rest/items/${rowId.value}`,
      method: 'put',
      data: addGoodsForm.value
    })
    console.log(res);
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '更新成功!'
      })
    }
    dialogAddVisible.value = false
    rowId.value = ''
    getGoods(pageParams)
  }
}
// 编辑
const handleEdit = async (row: any) => {
  rowId.value = row._id
  dialogAddVisible.value = true
  isAddStatus.value = false
  imageUrl.value = row.icon
  addGoodsForm.value = row
  addGoodsForm.value.star = Number(row.star)
  await nextTick()
  app?.ctx.$refs.goodsName.focus()
}
// 删除
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
    console.log(response);
    const res = await $http({
      url: `/rest/items/${row._id}`,
      method: 'delete'
    })
    // console.log(res);
    if (res.status === 200) {
      // ElMessage({
      //   type: 'success',
      //   message: '删除成功'
      // })
      getGoods(pageParams)
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

const dialogClosed = () => {
  addGoodsForm.value = {
    name: '',
    icon: '',
    star: 0,
    desc: '',
    detail: ''
  }
}

const imageUrl = ref('')
// todo: 需要修改上传路径
const actionUrl = 'http://localhost:3333/admin/api/upload/item'
// 上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // console.log(response, uploadFile);
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  addGoodsForm.value.icon = response.url
}

// 分页
// 每页条数改变
const handleSizeChange = (val: number) => {
  pageParams.pagesize = val
  getGoods(pageParams)
}
// 页数改变
const handleCurrentChange = (val: number) => {
  pageParams.pagenum = val
  getGoods(pageParams)
}

</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-button>span {
    line-height: 1.2;
  }
}
.table {
  margin-top: 20px;
  .expand {
    padding: 5px 15px;
    p {
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
      margin-bottom: 5px;
      line-height: 1.5;
      font-size: 14px;
      span {
        margin-right: 5px;
        font-weight: bold;
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
}
.pagination-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  :deep(.el-upload) {
    box-sizing: border-box;
    width: 150px;
    height: 150px;
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
  :deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
  }
} 

.rate {
  line-height: 1;
}

:deep(.add-goods) {
  max-width: 700px;
  .el-dialog__body {
    padding-bottom: 10px;
  }
}

</style>