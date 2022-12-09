<template>
  <div class="login-page">
    <div class="login-rule-form">
      <h1 class="title">
        <div class="title-text">{{$t(`login.title`)}}</div>
        <div class="translate-btn">
          <TranslateBtn></TranslateBtn>
        </div>
      </h1>
      <el-form
        ref="ruleFormEl"
        :model="ruleForm"
        :rules="rules"
        class="ruleForm"
      >
        <el-form-item class="username" prop="userName">
          <el-input
            clearable
            size="large"
            :prefix-icon="UserFilled"
            placeholder="用户名"
            v-model="ruleForm.userName"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="password" prop="passWord">
          <el-input
            show-password
            size="large"
            :prefix-icon="Lock"
            placeholder="密码"
            v-model="ruleForm.passWord"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button size="large" type="primary" @click="submitForm(ruleFormEl)">{{$t(`login.loginBtn`)}}</el-button>
          <el-button size="large" @click="switchUser">{{$t(`login.switchBtn`)}}</el-button>
          <!-- <el-button size="large" @click="resetForm(ruleFormRef)">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Cookies from 'js-cookie'
import { UserFilled, Lock } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/login';
import loading from '@/utils/loading'
import { commonStore } from "@/store/index"

const { proxy: { $lodash } }: any = getCurrentInstance()
const route = useRoute()
const router = useRouter()
// 绑定到表单的用户名,密码
const ruleForm = reactive({
  userName: "admin",
  passWord: "123456",
});
const ruleFormEl = ref<FormInstance>();

// 校验用户名
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
// 校验密码
const validatePass = (rule: any, value: any, callback: any) => {
  if (value.trim() === "") {
    callback(new Error("请输入密码!"));
  } else {
    if (value.length < 6) {
      callback(new Error("密码该6位以上!"));
    } else {
      callback();
    }
  }
};
// 表单验证规则
const rules = reactive<FormRules>({
  userName: [{ validator: checkUserName, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

// 切换用户
const switchUser = () => {
  if(ruleForm.userName === 'admin') {
    ruleForm.userName = 'xiaoming'
  } else {
    ruleForm.userName = 'admin'
  }
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 登录
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      loading.openLoading()
      try {
        const loginRes = await login(ruleForm)
        if (loginRes?.status === 200) {
          // console.log(loginRes.data);
          const { token, userName, userRoles } = loginRes.data
          // https://github.com/js-cookie/js-cookie
          // 设置过期时间 https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day 
          const ExpiredTime = new Date(Date.now() + commonStore().expiredTime)
          // 记录当前登录时间戳
          Cookies.set('loginTime', Date.now())
          Cookies.set('token', token, { expires: ExpiredTime })
          Cookies.set('userName', userName, { expires: ExpiredTime })
          Cookies.set('userRoles', JSON.stringify(userRoles), { expires: ExpiredTime })
          route.query.redirect ? router.replace({ path: String(route.query.redirect) }) : router.replace({ name: "home" })
          ElNotification({
            duration: commonStore().tipDurationS,
            message: '登录成功!',
            type: 'success',
          })
        }
        loading.closeLoading()
      } catch (err: any) {
        console.log('登录接口错误:', err);
        ElNotification({
          duration: commonStore().tipDurationS,
          message: `登录失败! ${err.message}`,
          type: 'error',
        })
      } finally {
        loading.closeLoading()
      }
    } else {
      ElNotification({
        duration: commonStore().tipDurationM,
        title: 'Warning',
        message: '请检查填写内容!',
        type: 'warning',
      })
      return false;
    }
  })
}

const keyDown = (e: any) => {
  if ((e.key as string).toLowerCase() === 'enter') { submitForm(ruleFormEl.value) }
}
// 回车触发登录, 防抖
const debounceKeyDown = $lodash.debounce(keyDown, 300)

onMounted(() => {
  // 点击退出按钮, 按回车, 跳转到登录页, 回去触发这里绑定的事件, 所以设置延迟
  setTimeout(() => {
    window.addEventListener('keydown', debounceKeyDown)
  }, 300)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', debounceKeyDown)
})
</script>
<style lang="scss" scoped>
@media screen and (max-width: 600px) {
  .login-rule-form {
    width: 100% !important;
  }
}
.login-page {
  height: 100%;
  background: url(../assets/img/login/login-bg.jpg) no-repeat;
  background-size: cover;
  background-position: center;
  
  .login-rule-form {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 25px;
    transform: translate(-50%, -50%);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 50%);
    animation: fadeUp ease-out .5s;
    box-sizing: border-box;
    width: 50%;
    max-width: 480px;
    min-width: 250px;

    .title {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 30px;
      position: relative;

      .title-text {
        text-align: center;
      }

      .translate-btn {
        position: absolute;
        top: 50%;
        right: 0;
        font-size: 0;
        transform: translateY(-50%);
        cursor: pointer;
      }
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

  :deep(.el-icon.el-input__icon) {
    font-size: 18px;
  }
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translate(-50%, -35%);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
</style>