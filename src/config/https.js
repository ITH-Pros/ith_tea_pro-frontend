import axios from "axios";
import { baseURL } from './index'


export const axiosInstance = axios.create({
    baseURL
});
axiosInstance.interceptors.request.use(
    function (req) {
        console.log("INnnnnnnnnnnnnnnnnnnnnnn req reqreq", req,)
        let accessToken = JSON.parse(localStorage.getItem('_u') || '{}')
        let accountId = JSON.parse(localStorage.getItem('user') || '{}')?.accountId
        console.log("accessToken accountId", accountId, accessToken)

        req.headers = {
            'x-access-token': accessToken,
            'x-access-user': accountId
        }
        return req;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (res) {
        console.log("INnnnnnnnnnnnnnnnnnnnnnn res res resres", res)
        return res;
    },
    async function (error) {
        console.log("INnnnnnnnnnnnnnnnnnnnnnn res error", error)
        // const originalConfig = error.config;

        if (error.response) {
            // Access Token was expired
            // if (error.response.status === 401 && !originalConfig._retry) {
            //     originalConfig._retry = true;

            //     try {
            //         const rs = await refreshToken();
            //         const { accessToken } = rs.data;
            //         window.localStorage.setItem("accessToken", accessToken);
            //         instance.defaults.headers.common["x-access-token"] = accessToken;

            //         return instance(originalConfig);
            //     } catch (_error) {
            //         if (_error.response && _error.response.data) {
            //             return Promise.reject(_error.response.data);
            //         }

            //         return Promise.reject(_error);
            //     }
            // }

            if (error.response.status === 403 && error.response.data) {
                return Promise.reject(error.response.data?.message);
            }
            if (error.response.status === 401 && error.response.data) {
                return Promise.reject(error.response.data?.message);
            }
        }

        return Promise.reject(error);
    }
);

