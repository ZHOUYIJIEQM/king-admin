<template>
  <div class="ad-page">
    <el-card>
      <el-button 
        v-permission="['admin']"
        style="margin-bottom: 15px;" 
        :icon="DocumentAdd"
        class="save-btn"
        type="primary"
        plain
        @click="createItem">{{$t(`btn.addAds`)}}</el-button>
      <el-table
        v-loading="tableLoading"
        empty-text="暂无轮播广告!"
        border
        :data="tableList"
      >
        <el-table-column type="expand" :label="$t(`tableH.expand`)" width="75">
          <template #default="props">
            <div class="expand">
              <div class="expand-item" v-for="(item, index) in props.row.items">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 18px;">{{`轮播图${index+1}`}}</div>
                <el-form-item label="轮播图片:">
                  <img class="banner-img" :src="item.img" alt="">
                </el-form-item>
                <el-form-item label="跳转地址:">
                  <a v-if="item.url.length" class="eli" target="_blank" :href="item.url">{{item.url}}</a>
                  <div v-else class="text eli">没有对应跳转地址!</div>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" :label="$t(`tableH.orderNum`)" width="70" />
        <el-table-column :label="$t(`tableH.category`)" prop="name" />
        <el-table-column :label="$t(`tableH.operation`)" align="center" width="160">
          <template #default="scope">
            <div class="option">
              <div style="margin-bottom: 6px;">
                <el-button
                  size="small"
                  type="primary"
                  plain
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                >{{$t(`btn.edit`)}} / {{$t(`btn.view`)}}</el-button>
              </div>
              <div>
                <el-button
                  size="small"
                  v-permission="['admin']"
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
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="pageParams.pageNum"
          v-model:page-size="pageParams.pageSize"
          :page-sizes="[5, 10, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="isAdd ? '添加' : '编辑'"
      @close="dialogClosed"
      draggable
    >
      <el-scrollbar
        max-height="55vh"
      >
        <div class="scroll-box">
          <el-input style="margin-bottom: 15px;" clearable ref="goodsName" v-model="adItemData.name" placeholder="请输入广告轮播名!"></el-input>
          <CardItemVue
            class="card-item"
            v-for="(item, index) in adItemData.items"
            :key="index"
            :title="`轮播${index+1}`"
            @close-item="adItemData.items.splice(index, 1)"
          >
            <UploadFileVue
              class="hero-avatar"
              :actionUrl="actionUrl"
              :imageUrl="item.img"
              @uploadSuccess="uploadSuccess($event, item, 'img')"
            ></UploadFileVue>
            <el-input style="margin-top: 8px;" clearable class="eli" v-model="item.url" placeholder="请输入广告跳转地址!"></el-input>
          </CardItemVue>
          <div class="card-item">
            <el-button class="button" text @click="addPic(adItemData.items)">
              <el-icon :size="25" class="plus"><Plus /></el-icon>
              <div style="margin-top: 10px;">添加一个轮播图</div>
            </el-button>
          </div>
        </div>
      </el-scrollbar>
      <template #footer>
        <div class="bottom">
          <el-button v-permission="['admin']" class="save-btn" type="primary" plain @click="saveContent">{{$t(`btn.save`)}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DocumentAdd, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref, onMounted } from "vue"
import CardItemVue from "@/components/CardItem.vue"
import UploadFileVue from "@/components/UploadFile.vue"
import { commonStore } from "@/store/index"
import { ElNotification } from 'element-plus'
import {saveScrollH} from '@/utils/saveScroll'
saveScrollH()

const app: any = getCurrentInstance()
const { proxy } = app
const { getAd, updateAd, createAd, deleteAd } = proxy.$AdApi
const tableList = ref<any[]>([])
const actionUrl = `${commonStore().uploadPath}advertisement`
const tableLoading = ref<boolean>(true)
const dialogVisible = ref<boolean>(false)
const isAdd = ref<boolean>(false)
const adItemData: any = ref()
const total = ref<number>(0)
// 请求页参数
interface GetGoods {
  pageNum: number,
  pageSize: number,
}
let pageParams: GetGoods = {
  pageNum: 1,
  pageSize: 5,
}


/**
 * 新建轮播
 */
const createItem = () => {
  isAdd.value = true
  dialogVisible.value = true
  adItemData.value = {
    name: "",
    items: [
      {
        img: "",
        url: ""
      }
    ]
  }
}

/**
 * 点击编辑
 */
const handleEdit = (val: any) => { 
  isAdd.value = false
  dialogVisible.value = true
  adItemData.value = val
}
/**
 * 点击删除
 */
const handleDelete = async (val: any) => {
  let res = await deleteAd(val._id)
  if (res.status === 200) {
    ElNotification({
      duration: commonStore().tipDurationS,
      type: 'success',
      message: '删除成功!'
    })
    await getAllAd()
  }
}
/**
 * 弹出层关闭触发
 */
const dialogClosed = () => { }
/**
 * 保存
 */
const saveContent = async () => {
  if (isAdd.value) {
    let res = await createAd(adItemData.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: '新增成功!'
      })
    }
  } else {
    // console.log('保存', adItemData);
    let res = await updateAd(adItemData.value._id, adItemData.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationS,
        type: 'success',
        message: '更新成功!'
      })
    }
  }
  dialogVisible.value = false
  await getAllAd()
}
/**
 * 添加轮播图片
 */
const addPic = async (item: any) => {
  item.push({
    "img": "",
    "url": ""
  })
}
// 每页条数改变
const handleSizeChange = async (val: number) => {
  pageParams.pageSize = val
  await getAllAd()
}
// 页数改变
const handleCurrentChange = async (val: number) => {
  pageParams.pageNum = val
  await getAllAd()
}

/**
 * 上传后
 */
const uploadSuccess = (val: string, data: any, key: string) => {
  // console.log(val, data, key);
  data[key] = val
}

/**
 * 获取所有轮播
 */
const getAllAd = async () => {
  try {
    // loading.openLoading()
    tableLoading.value = true
    let res = await getAd(pageParams)
    // console.log(res);
    tableList.value = res.data.data
    total.value = res.data.total
    // console.log(tableList.value);
  } catch (error) {
    console.log(error); 
  } finally {
    // loading.closeLoading()
    tableLoading.value = false
  }
}

onMounted(async () => {
  await getAllAd()
})

</script>
<style lang="scss" scoped>
.ad-page {
  :deep(.el-table) {
    .expand {
      padding: 10px 15px;
      overflow: hidden;
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
  :deep(.el-dialog) {
    max-width: 700px;
    min-width: 400px;
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding: 10px 15px 15px;
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
  }
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>