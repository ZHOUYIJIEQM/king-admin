import { featureInstance } from "./instance";
import type {loginParams} from '../models/api'

const LoginApi = {
  /**
   * 登录接口
   */ 
  login(params: loginParams) {
    return featureInstance({
      url: '/login',
      method: 'post',
      data: params
    })
  },
}

export default LoginApi