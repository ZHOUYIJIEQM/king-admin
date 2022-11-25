import { apiInstance } from "./instance";
import type { tableQueryType } from "@/models/api"

export function getSummoner(params?: tableQueryType) {
  return apiInstance({
    url: "/summoner",
    params
  })
}

export function createSummoner(data: any) {
  return apiInstance({
    url: "/summoner",
    method: "POST",
    data
  })
}

export function getSummonerById(id: string) {
  return apiInstance({
    url: `/summoner/${id}`
  })
}

export function updateSummoner(id: string, data: any) {
  return apiInstance({
    url: `/summoner/${id}`,
    method: 'put',
    data
  })
}

export function deleteSummoner(id: string) {
  return apiInstance({
    url: `/summoner/${id}`,
    method: 'delete'
  })
}

export function searchSummonerByName(data: any) {
  return apiInstance({
    url: "/summoner/search",
    method: "post",
    data
  })
}

