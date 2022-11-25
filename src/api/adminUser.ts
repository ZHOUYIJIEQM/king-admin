import { apiInstance } from "./instance";

export function getUsers(params: any) {
  return apiInstance({
    url: "/adminUser",
    params,
  });
}

export function createUser(data: any) {
  return apiInstance({
    url: "/adminUser",
    method: "post",
    data,
  });
}

export function updateUser(id: string, data: any) {
  return apiInstance({
    url: `/adminUser/${id}`,
    method: "put",
    data,
  });
}

export function deleteUser(id: string) {
  return apiInstance({
    url: `/adminUser/${id}`,
    method: "delete",
  });
}

/**
 * 通过名称搜索
 * @param data
 */
 export function getUserByName(data: any) {
  return apiInstance({
    url: "/adminUser/search",
    method: "post",
    data,
  });
}