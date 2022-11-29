<template>
  <TableCard
    :isAdd="isAdd"
    :btnAdd="$t('btn.addAds')"
    :dialogTitle="isAdd ? $t('btn.addAds') : $t('btn.editAds')"
    v-model:visible="dialogVisible"
    @addDataItem="addDataItem"
    @saveContent="saveContent"
    @dialogClosed="dialogClosed"
  >
    <template #table>
      <el-table
        v-loading="tableLoading"
        empty-text="暂无广告!"
        border
        :data="tableData"
      >
        <el-table-column class-name="expand" type="expand" :label="$t(`tableH.expand`)" width="85">
          <template #default="props">
            <div class="expand">
              <div class="expand-item" v-for="(item, index) in props.row.items">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 18px;">{{`轮播图${index+1}`}}</div>
                <el-form>
                  <el-form-item label="轮播图片:">
                    <img class="banner-img" :src="item.img" alt="">
                  </el-form-item>
                  <el-form-item label="跳转地址:">
                    <a v-if="item.url.length" class="eli" target="_blank" :href="item.url">{{item.url}}</a>
                    <div v-else class="text eli">没有对应跳转地址!</div>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" type="index" :label="$t(`tableH.orderNum`)" width="70" />
        <el-table-column min-width="180px" :label="$t(`tableH.category`)" prop="name" />
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="180">
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
    <template #dialog>
      <div class="scroll-box">
        <el-input style="margin-bottom: 15px;" clearable ref="nameEl" v-model="formData.name" placeholder="请输入广告轮播名!"></el-input>
        <CardItem
          class="card-item"
          v-for="(item, index) in formData.items"
          :key="index"
          :title="`轮播${index+1}`"
          @close-item="formData.items.splice(index, 1)"
        >
          <UploadFile
            class="hero-avatar"
            :actionUrl="actionUrl"
            :imageUrl="item.img"
            @uploadSuccess="uploadSuccess($event, item, 'img')"
          ></UploadFile>
          <el-input style="margin-top: 8px;" clearable class="eli" v-model="item.url" placeholder="请输入广告跳转地址!"></el-input>
        </CardItem>
        <div class="card-item">
          <el-button class="button" text @click="addPic(formData.items)">
            <el-icon :size="25" class="plus"><Plus /></el-icon>
            <div style="margin-top: 10px;">添加一个轮播图</div>
          </el-button>
        </div>
      </div>
    </template>
  </TableCard>
</template>
<script lang="ts" setup>
import { getAd, createAd, updateAd, deleteAd } from '@/api/ad'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { commonStore } from "@/store/index"
import { permissionStore } from "@/store/permission"

const { proxy }: any = getCurrentInstance()
const { $lodash } = proxy
// 是否显示弹出框
const dialogVisible = ref<boolean>(false)
// 是否添加
const isAdd = ref<boolean>(false)
// 表格数据
const tableData = ref<any []>([])
// 表格加载提示
const tableLoading = ref<boolean>(false)
// 表单数据
const formData = ref<any>({})
// 上传接口
const actionUrl = `${commonStore().uploadPath}/advertisement`
// 上传后
const uploadSuccess = (val: string, data: any, key: string) => {
  // console.log(val, data, key);
  data[key] = val
}
// 点击编辑
const handleEdit = async (val: any) => { 
  isAdd.value = false
  dialogVisible.value = true
  formData.value = $lodash.cloneDeep(val)
  await nextTick()
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 100)
}
// 点击删除
const handleDelete = async (val: any) => {
  let res = await deleteAd(val._id)
  if (res.status === 200) {
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'success',
      message: '删除成功!'
    })
  }
  await getTableData()
}
// 添加
const addDataItem = async () => {
  isAdd.value = true
  dialogVisible.value = true
  formData.value = {
    items: []
  }
  setTimeout(() => {
    proxy.$refs.nameEl.focus()
  }, 100)
}
// 保存
const saveContent = async () => {
  tableLoading.value = true
  dialogVisible.value = false
  let res: any = {}
  if (isAdd.value) {
    res = await createAd(formData.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: '添加分类成功!',
        type: 'success',
      })
    }
  } else {
    res = await updateAd(formData.value._id, formData.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        title: 'Success',
        message: '更新成功!',
        type: 'success',
      })
    }
  }
  await getTableData()
}
// 添加轮播图片
const addPic = async (item: any) => {
  item.push({
    "img": "",
    "url": ""
  })
}
// 获取表格数据
const getTableData = async () => {
  tableLoading.value = true
  const res = await getAd()
  tableData.value = res.data
  tableLoading.value = false
}
// 弹出框关闭时
const dialogClosed = async () => {
  setTimeout(() => {
    formData.value = {}
  }, 500);
}

onMounted(async () => {
  await getTableData()
})
</script>
<style lang="scss" scoped>
@import '@/styles/tableCard.scss';

:deep(.el-table) {
  .expand {
    padding: 10px 15px;
    overflow: hidden;
    .el-form {
      padding: 0;
    }
    .expand-item {
      &:last-child {
        margin-bottom: 0;
      }
      margin-bottom: 18px;
      .el-form-item {
        margin-bottom: 0;
      }
      .banner-img {
        width: 60%;
        max-width: 500px;
        min-height: 50px;
        border-radius: 6px;
      }
      a {
        text-decoration: none;
        color: #6f8fcf;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .text {
        color: #6f8fcf;
        cursor: pointer;
      }
    }
  }
  .option {
    .el-button {
      width: 100%;
    }
  }
}
.scroll-box {
  padding: 15px;
  .card-item {
    .button {
      border: 2px dashed #e4e7ed;
      min-height: 100px;
      width: 100%;
      &>span {
        flex-direction: column;
      }
    }
    &:hover {
      border-color: #aaa;
    }
    .el-upload {
      width: 100%;
    }
    .el-input {
      width: 100%;
      .el-input__wrapper {
        width: 100%;
        box-sizing: border-box;
        input {
          text-overflow: ellipsis;
        }
      }
    }
  }
}
:deep(.avatar-uploader) {
  .el-upload {
    width: 70% !important;
  }
}
</style>