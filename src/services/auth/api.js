import axios from 'axios';
let url = 'http://192.168.29.131:9000';


export function userLogin(data) {
    console.log(data)
    return (axios.post(url + '/auth/v1/user/login', data).then(res => res.data))
  }