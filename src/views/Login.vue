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
import { reactive, ref } from "vue";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

const ruleFormRef = ref<FormInstance>();

const checkUserName = (rule: any, value: any, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入用户名!"));
  } else {
    callback();
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
  username: "",
  password: "",
});

const rules = reactive({
  username: [{ validator: checkUserName, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
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