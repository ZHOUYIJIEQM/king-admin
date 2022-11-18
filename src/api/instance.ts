import axios, { type AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus';
import { commonStore } from "@/store/index"
import Cookies from 'js-cookie'

const apiInstance = axios.create({
  // baseURL: "https://app.yjsjyb.top/admin/api/resource",
  baseURL: "http://localhost:3080/admin/api/resource",
  // baseURL: "http://192.168.1.5:3080/admin/api/resource",
  timeout: 8 * 1000,
})
apiInstance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `${token}`
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
    ElNotification({
      duration: commonStore().tipDurationS,
      message: `${error.response.data.message}`,
      type: 'error',
    })
    // todo: 加入未登录跳转
    if (error.response.status === 401) { }
    // 用户名 密码 错误
    if (error.response.status === 422) {
      ElNotification({
        title: '请求错误!',
        message: `${error.response.data.message}`,
        type: 'error',
      })
    }
    // return Promise.reject(error);
  }
)

const featureInstance = axios.create({
  // baseURL: "https://app.yjsjyb.top/admin/api",
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
      ElNotification({
        title: '请求错误!',
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

