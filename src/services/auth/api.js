import { axiosInstance } from "./../../config/https";

export function loginUser(data) {
  return axiosInstance.post("auth/v1/user/login", data).then((res) => res.data);
}

export function resetPassword(data) {
  return axiosInstance.patch("auth/v1/user/reset/password", data).then((res) => res.data);
}

export function forgotPassword(data) {
  return axiosInstance.post("auth/v1/user/forgot/password", data).then((res) => res.data);
}

export function verifyOtp(data) {
  return axiosInstance.post("auth/v1/otp/verify/forgot/password", data).then((res) => res.data);
}

export function changePassword(data) {
  return axiosInstance.patch("auth/v1/user/forgot/change/password", data).then((res) => res.data);
}
