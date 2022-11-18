import { apiInstance } from "./instance";
import type { tableQueryType } from "@/models/api"

export function getInscription(params: tableQueryType) {
  return apiInstance({
    url: "/inscription",
    params
  })
}

export function createInscription(data: any) {
  return apiInstance({
    url: "/inscription",
    method: "POST",
    data
  })
}

export function getInscriptionById(id: string) {
  return apiInstance({
    url: `/inscription/${id}`
  })
}

export function updateInscription(id: string, data: any) {
  return apiInstance({
    url: `/inscription/${id}`,
    method: 'put',
    data
  })
}

export function deleteInscription(id: string) {
  return apiInstance({
    url: `/inscription/${id}`,
    method: 'delete'
  })
}

export function searchInscriptionByName(data: any) {
  return apiInstance({
    url: "/inscription/search",
    method: "post",
    data
  })
}

