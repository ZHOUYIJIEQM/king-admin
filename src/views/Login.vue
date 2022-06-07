<template>
  <div class="login-page">
    <div class="login-ruleForm">
      <h1 class="title">后台管理</h1>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="0"
        class="ruleForm"
      >
        <el-form-item class="username" prop="username">
          <el-input
            size="large"
            :prefix-icon="UserFilled"
            placeholder="用户名"
            v-model="ruleForm.username"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="password" prop="password">
          <el-input
            size="large"
            :prefix-icon="Lock"
            placeholder="密码"
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
          <el-button size="large" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from "vue";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import loading from '@/utils/loading'

const ruleFormRef = ref<FormInstance>();
const app = getCurrentInstance()
const $http = app?.appContext.config.globalProperties.$http
const router = useRouter()

const checkUserName = (rule: any, value: any, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入用户名!"));
  } else {
    if(value.length < 3) {
      callback(new Error("用户名应不小于3位!"))
    } else {
      callback();
    }
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码!"));
  } else {
    if (value.length < 6) {
      callback(new Error("密码该6位以上!"));
    } else {
      callback();
    }
  }
};

const ruleForm = reactive({
  username: "admin",
  password: "123456",
});

const rules = reactive({
  username: [{ validator: checkUserName, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

/**
 * 登录
 */
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      // todo: 登录操作
      loading.openLoading()
      try {
        const loginRes = await $http({
          url: '/login',
          method: 'post',
          data: ruleForm
        })
        if (loginRes?.status === 200) {
          sessionStorage.setItem('token', loginRes.data.token)
          router.push('/')
          ElMessage({
            showClose: true,
            message: '登录成功!',
            type: 'success'
          })
        } else if (loginRes) {
          // 失败
          ElMessage(loginRes.data?.message)
        }
        loading.closeLoading()
      } catch (err) {
        console.log(err);
      } finally {
        loading.closeLoading()
      }
    } else {
      // todo: 不能提交
      console.log("error submit!");
      ElMessage({
        showClose: true,
        message: '请检查填写内容',
        type: 'warning',
      })
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  background: url(../assets/img/login/login-bg.jpg) no-repeat;
  background-size: cover;

  .login-ruleForm {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 30px;
    transform: translate(-50%, -50%);
    width: 25%;
    height: 30%;
    min-width: 400px;
    min-height: 230px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 50%);

    .title {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    .username, .password {
      margin-bottom: 30px;
    }

    .btns {
      margin-bottom: 0px;

      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }
    }
  }
}
</style>