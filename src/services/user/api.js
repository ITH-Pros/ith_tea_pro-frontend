import { axiosInstance } from './../../config/https'

export function addRating(data) {
  return (axiosInstance.post('/rating/v1/user/insert', data).then(res => res.data))
}
export function addComment(data) {
  return (axiosInstance.post('/comment/v1/user/insert', data).then(res => res.data))
}
export function editUserDetail(data) {
  return (axiosInstance.patch('/user/v1/edit/', data).then(res => res.data))
}
export async function getAllUsers() {
  return (axiosInstance.get('/user/v1/all').then(res => res.data))
}
export async function getAllProjects() {
  return (axiosInstance.get('/projects/v1/all').then(res => res.data))
}
export async function getUsersOfProject(data) {
  return (axiosInstance.get('/projects/v1/user/all', data).then(res => res.data))
}
export async function getUserAssignedProjects(data) {
  return (axiosInstance.get('/projects/v1/user/assigned', data).then(res => res.data))
}
export async function assignUserToProject(data) {
  return (axiosInstance.patch('/projects/v1/assign/users', data).then(res => res.data))
}
export async function unAssignUserToProject(data) {
  return (axiosInstance.patch('/projects/v1/remove/user', data).then(res => res.data))
}
export async function updateUserRating(data) {
  return (axiosInstance.patch('/rating/v1/user/update', data).then(res => res.data))
}
export async function getComment(data) {
  return (axiosInstance.get('/comment/v1/rating', data).then(res => res.data))
}
export async function getProjectsTask(data) {
  return (axiosInstance.get('/task/v1/groupby', data).then(res => res.data))
}
export async function getTaskDetailsByTaskId(data) {
  return (axiosInstance.get('/task/v1/by/taskId', data).then(res => res.data))
}
export async function updateTaskDetails(data) {
  return (axiosInstance.patch('/task/v1/edit', data).then(res => res.data))
}
export async function createTask(data) {
  return (axiosInstance.post('/task/v1/user/insert', data).then(res => res.data))
}
export async function getTaskStatusAnalytics(data) {
  return (axiosInstance.get('/task/v1/status/analytics', data).then(res => res.data))
}
export function addCommentOnTaskById(data) {
  return (axiosInstance.post('/comment/v1/user/task/insert', data).then(res => res.data))
}

export async function getRatings(data) {
  console.log(data, '-------------------------------------------------------------------data from api')
  return (axiosInstance.get('/rating/v1/month/all/user', {
    params: {
      month: data?.month,
      year: data?.year
    }
  }).then(res => res.data))
}
