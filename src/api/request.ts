import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus';

const instance = axios.create({
  baseURL: "http://localhost:3333/admin/api",
  // baseURL: "http://192.168.1.13:3333/admin/api",
  timeout: 5000,
})
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = sessionStorage.token
    console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bear ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error);
  }
)
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    ElMessage({
      showClose: true,
      message: `${error.response.data.message}`,
      type: 'error',
    })
    
    // todo: 加入未登录跳转
    if (error.response.status === 401) { }
    if (error.response.status === 422) {
      // ElMessage({
      //   showClose: true,
      //   message: `${error.response.data.message}`,
      //   type: 'error',
      // })
    }
  }
)

export default {
  install(app:any) {
    app.config.globalProperties.$http = instance;
  }
};
