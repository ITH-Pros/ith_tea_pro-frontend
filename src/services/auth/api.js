import { axiosInstance } from './../../config/https'

export function loginUser(data) {
  return (axiosInstance.post('auth/v1/user/login', data).then(res => res.data))
}