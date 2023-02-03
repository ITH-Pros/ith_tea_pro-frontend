import axios from "axios";
import { baseURL } from './index'
import { useNavigate } from 'react-router-dom';


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
                return Promise.reject(error.response.data?.message);
            }
            if (error.response.status === 401 && error.response.data) {
                useNavigate('/login')
                return Promise.reject(error.response.data?.message);
            }
        }
        return error.response

        // return Promise.reject(error);
    }
);

