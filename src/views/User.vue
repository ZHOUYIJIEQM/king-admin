<template>
  <div class="ad-page">
    <el-card>
      <el-button 
        style="margin-bottom: 15px;" 
        :icon="DocumentAdd"
        class="save-btn"
        type="primary"
        plain
        @click="createItem">新建用户</el-button>
      <el-table
        v-loading="tableLoading"
        empty-text="暂无用户信息!"
        border
        :data="tableList"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="用户名称" prop="username" />
        <el-table-column label="权限级别" prop="level" width="150" />
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <div class="option">
              <div style="margin-bottom: 6px;">
                <el-button
                  size="small"
                  type="primary"
                  plain
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                >修改</el-button>
              </div>
              <div>
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
          <el-form label-position="right">
            <el-form-item label="用户名称">
              <el-input clearable v-model="dialogData.username" placeholder="请输入用户名!"></el-input>
            </el-form-item>
            <el-form-item label="权限级别">
              <el-select v-model="dialogData.level" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in 5"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户密码">
              <el-input type="password" show-password v-model="dialogData.password" placeholder="请输入密码!"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" show-password v-model="dialogData.checkPassword" placeholder="再次输入密码!"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <template #footer>
        <div class="bottom">
          <el-button class="save-btn" type="primary" plain @click="saveContent">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DocumentAdd, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref, onMounted } from "vue"
import loading from '@/utils/loading'
import { commonStore } from "@/store/index"
import { ElNotification } from 'element-plus'
import { deepClone } from "@/utils/func";

const app: any = getCurrentInstance()
const { proxy } = app
const { getUsers, createUser, updateUser, deleteUser } = proxy.$UserApiApi
const tableList = ref<any[]>([])
const actionUrl = `${commonStore().uploadPath}advertisement`
const tableLoading = ref<boolean>(true)
const dialogVisible = ref<boolean>(false)
const isAdd = ref<boolean>(false)
const total = ref<number>(0)
const dialogData: any = ref({})
// 请求页参数
let pageParams: any = {
  pageNum: 1,
  pageSize: 5,
}


/**
 * 新建
 */
const createItem = () => {
  isAdd.value = true
  dialogVisible.value = true
  
}

/**
 * 点击编辑
 */
const handleEdit = (val: any) => { 
  isAdd.value = false
  dialogVisible.value = true
  dialogData.value = deepClone(val)
  // console.log('---', dialogData.value);
  // deepClone(val)
}
/**
 * 点击删除
 */
const handleDelete = async (val: any) => {
  try {
    let res = await deleteUser(val._id)
    if (res.status === 200) {
      ElNotification({
        type: 'success',
        message: '删除成功!'
      })
      await getUser()
    }
  } catch (error) {
    console.log(error);
  }
}
/**
 * 弹出层关闭触发
 */
const dialogClosed = () => {
  dialogData.value = {
    username: "",
    level: "",
    password: "",
    checkPassword: ""
  }
}
/**
 * 保存
 */
const saveContent = async () => {
  try {
    if (isAdd.value) {
      // todo: 添加
      let res = await createUser(dialogData.value)
      // console.log('添加', res);
      if (res.status === 200) {
        ElNotification({
          type: 'success',
          message: '新增成功!'
        })
      }
    } else {
      // todo: 更新
      // console.log('保存', adItemData);
      let res = await updateUser(dialogData.value._id, dialogData.value)
      // console.log('更新', res);
      if (res.status === 200) {
        ElNotification({
          type: 'success',
          message: '更新成功!'
        })
      }
    }
    dialogVisible.value = false
    await getUser()
  } catch (error) {
    console.log(error);
  }
}

// 每页条数改变
const handleSizeChange = async (val: number) => {
  pageParams.pageSize = val
  await getUser()
}
// 页数改变
const handleCurrentChange = async (val: number) => {
  pageParams.pageNum = val
  await getUser()
}

/**
 * 获取所有轮播
 */
const getUser = async () => {
  try {
    // loading.openLoading()
    tableLoading.value = true
    let res = await getUsers(pageParams)
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
  await getUser()
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