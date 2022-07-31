import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus';

const apiInstance = axios.create({
  // baseURL: "http://localhost:3080/admin/api",
  baseURL: "http://192.168.1.5:3080/admin/api/resource",
  timeout: 8 * 1000,
})
apiInstance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = sessionStorage.token
    if (token) {
      config.headers.Authorization = `Bear ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error);
  }
)
apiInstance.interceptors.response.use(
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
    // 用户名 密码 错误
    if (error.response.status === 422) {
      ElMessage({
        showClose: true,
        message: `${error.response.data.message}`,
        type: 'error',
      })
    }
    // return Promise.reject(error);
  }
)

const featureInstance = axios.create({
  baseURL: "http://localhost:3080/admin/api",
  // baseURL: "http://192.168.1.5:3080/admin/api",
  timeout: 8 * 1000,
})

featureInstance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    return config
  },
  error => {
    return Promise.reject(error);
  }
)
featureInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('错误:', error);
    // 用户名 密码 错误
    if (error.response.status === 422) {
      ElMessage({
        showClose: true,
        message: `${error.response.data.message}`,
        type: 'error',
      })
    }
    return Promise.reject(error);
  }
)

export {
  apiInstance,
  featureInstance,
}

