import axios from "axios";
import { logOut } from "../helpers/logOut";
import { baseURL } from "./index";
import { useNavigate } from "react-router-dom";

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  function (req) {
    let accessToken = JSON.parse(localStorage.getItem("_u") || "{}");
    let accountId = JSON.parse(localStorage.getItem("user") || "{}")?.accountId;
    req.headers = {
      "x-access-token": accessToken,
      "x-access-user": accountId,
    };
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (res) {
    console.log(res?.status,'-----------------------------RES')
    return res;
  },
  async function (error) {

    console.log(error,'-----------------------------RES')

    if (error.response) {
      if (error.response.status === 403 ) {
        localStorage.clear();
        window.location.href='/login'

          window.location.reload();
        
      }
      if (error.response.status === 401 ) {
        localStorage.clear();
        window.location.href='/login'

          window.location.reload();
        
      }
    }
    return error.response;
  }
);
