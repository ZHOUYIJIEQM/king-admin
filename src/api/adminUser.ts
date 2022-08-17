import { apiInstance } from "./instance";

const UserApi = {
  getUsers(params: any) {
    return apiInstance({
      url: "/adminUser",
      params
    })
  },
  createUser(data: any) {
    return apiInstance({
      url: "/adminUser",
      method: "post",
      data,
    });
  },
  updateUser(id: string, data: any) {
    return apiInstance({
      url: `/adminUser/${id}`,
      method: "put",
      data,
    })
  },
  deleteUser(id: string) {
    return apiInstance({
      url: `/adminUser/${id}`,
      method: "delete",
    })
  }
}

export default UserApi