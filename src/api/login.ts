import { featureInstance } from "./instance";
import type { loginParams } from '../models/api'

export function login(params: loginParams) {
  return featureInstance({
    url: '/login',
    method: 'post',
    data: params
  })
}