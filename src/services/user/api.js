import axios from 'axios';
let url = 'http://192.168.1.38:9000'
// let url = 'http://192.168.29.78:9000'
// let url = 'http://localhost:9000'

export function addRating(data) {
  return (axios.post(url + '/rating/v1/user/insert', data).then(res => res.data))
}
export function addComment(data) {
  return (axios.post(url + '/comment/v1/user/insert', data).then(res => res.data))
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
export async function getUserAssignedProjects(data) {
  return (axios.get(url + '/projects/v1/user/assigned', data).then(res => res.data))
}
export async function assignUserToProject(data) {
  return (axios.patch(url + '/projects/v1/assign/users', data).then(res => res.data))
}
export async function unAssignUserToProject(data) {
  return (axios.patch(url + '/projects/v1/remove/user', data).then(res => res.data))
}
export async function updateUserRating(data) {
  return (axios.patch(url + '/rating/v1/user/update', data).then(res => res.data))
}
export async function getComment(data) {
  return (axios.get(url + '/comment/v1/rating', data).then(res => res.data))
}
export async function getProjectsTask(data) {
  return (axios.get(url + '/task/v1/groupby', data).then(res => res.data))
}
export async function getTaskDetailsByTaskId(data) {
  return (axios.get(url + '/task/v1/by/taskId', data).then(res => res.data))
}
export async function updateTaskDetails(data) {
  return (axios.patch(url + '/task/v1/edit', data).then(res => res.data))
}
export function addCommentOnTaskById(data) {
  return (axios.post(url + '/comment/v1/user/task/insert', data).then(res => res.data))
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
