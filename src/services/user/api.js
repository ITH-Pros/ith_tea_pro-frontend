import axios from 'axios';
let url='http://192.168.29.78:9000' 
// let url = 'http://localhost:9000'

export function addRating(data) {
  return (axios.post(url + '/rating/v1/user/insert', data).then(res => res.data))
}
export function editUserDetail(data) {
  return (axios.patch(url + '/user/v1/edit/', data).then(res => res.data))
}

export async function getAllUsers() {
  return (axios.get(url + '/user/v1/all').then(res => res.data))
}

export async function getAllProjects() {
  return (axios.get(url + '/projects/v1/all').then(res => res.data))
}

export async function getUsersOfProject(data) {
  return (axios.get(url + '/projects/v1/user/all', data).then(res => res.data))
}


export async function getRatings(data) {
  console.log(data, '-------------------------------------------------------------------data from api')
  return (axios.get(url + '/rating/v1/month/all/user', {
    params: {
      month: data?.month,
      year: data?.year
    }
  }).then(res => res.data))
}