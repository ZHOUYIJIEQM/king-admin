import axios, { type AxiosRequestConfig } from 'axios'


const instance = axios.create({
  baseURL: "http://192.168.31.43:3333/admin/api",
  timeout: 5000,
})
instance.interceptors.request.use(
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
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // todo: 加入未登录跳转
    if (error.response.status === 401) { }
  }
)

export default {
  install(app:any) {
    app.config.globalProperties.$http = instance;
  }
};
