import axios, { type AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus';
import { commonStore } from "@/store/index"
import Cookies from 'js-cookie'

const apiInstance = axios.create({
  baseURL: commonStore().baseUrl,
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
        duration: commonStore().tipDurationM,
        title: '发生错误!',
        message: `${error.response.data.message}`,
        type: 'error',
      })
    }
    // return Promise.reject(error);
  }
)

const featureInstance = axios.create({
  baseURL: commonStore().featureBaseUrl,
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
        duration: commonStore().tipDurationM,
        title: '发生错误!',
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

