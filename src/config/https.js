import axios from "axios";
import { logOut } from "../helpers/logOut";
import { baseURL } from './index'


export const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(
    function (req) {
        let accessToken = JSON.parse(localStorage.getItem('_u') || '{}')
        let accountId = JSON.parse(localStorage.getItem('user') || '{}')?.accountId

        req.headers = {
            'x-access-token': accessToken,
            'x-access-user': accountId
        }
        return req;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (res) {
        return res;
    },
    async function (error) {
        if (error.response) {
            if (error.response.status === 403 && error.response.data) {
                logOut();
                return Promise.reject(error.response.data?.message);
            }
            if (error.response.status === 401 && error.response.data) {
				console.log("error", error.response.data)
                logOut();
                return Promise.reject(error.response.data?.message);
            }
        }
		
        return error.response

        // return Promise.reject(error);
    }
);

