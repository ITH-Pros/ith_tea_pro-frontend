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
export function addNewUserDetail(data) {
    return (axiosInstance.post('/user/v1/add/', data).then(res => res.data))
}
export function getUserDetailsByUserId(data) {
    return (axiosInstance.get('/user/v1/userId', data).then(res => res.data))
}
export async function getAllUsers(data) {
    return (axiosInstance.get('/user/v1/all/pagination',data).then(res => res.data))
}
export async function getAllUserWithoutPagination(data) {
    return (axiosInstance.get('/user/v1/list',data).then(res => res.data))
}
export async function getAllLeadsWithoutPagination(data) {
    return (axiosInstance.get('/user/v1/leads/list',data).then(res => res.data))
}
export async function getprojectListWithoutCat(data) {
  return axiosInstance.get("/projects/v1/list", data).then((res) => res.data);
}

export async function getAllUserDataForRating(data) {
	return (axiosInstance.get('/user/v1/list',data).then(res => res.data))
}
export async function getAllProjects(data) {
    return (axiosInstance.get('/projects/v1/all', { params: data,}).then(res => res.data))
}
export async function getAllCategories(data) {
    return (axiosInstance.get('/projects/v1/categories', { params: data,}).then(res => res.data))
}
export async function getAllUsersWithoutPagination(data) {
    return (axiosInstance.get('/user/v1/all', { params: data,}).then(res => res.data))
}
export async function getAllMyWorks(data) {
    return (axiosInstance.get('/task/v1/list/homepage', { params: data,}).then(res => res.data))
}
export async function getAllPendingRating(data) {
    return (axiosInstance.get('/task/v1/list/pending/rating', { params: data,}).then(res => res.data))
}
export async function getAllAssignedProject(data) {
	return (axiosInstance.get('/projects/v1/list/assigned', { params: data,}).then(res => res.data))
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
export async function deleteProjectById(data) {
    return (axiosInstance.patch('/projects/v1/delete', data).then(res => res.data))
}
export async function getProjectDetailsById(data) {
	return (axiosInstance.get('/projects/v1/by/projectId', data).then(res => res.data))
}
export async function addNewProject(data) {
    return (axiosInstance.post('/projects/v1/add/new', data).then(res => res.data))
}
export async function updateProjectForm(data) {
	return (axiosInstance.patch('/projects/v1/edit', data).then(res => res.data))
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
    return axiosInstance
      .get("/task/v1/groupby", {
        params: data,
      })
      .then((res) => res.data);
}

export async function getTaskDetailsByProjectId(data) {
	return (axiosInstance.get('task/v1/list/for/rating', { params: data}).then(res => res.data) )
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
    return (axiosInstance.get('/rating/v1/week/rating', {
        params: data
    }).then(res => res.data))
}
export async function getAssignedProjects(data){
	return (axiosInstance.get('/projects/v1/list/assigned', data).then(res => res.data));
}

export async function getLogedInUserDetails(data){
	return (axiosInstance.get('user/v1/userId', data).then(res => res.data));
}

export async function editLogedInUserDetails(data){
	return (axiosInstance.patch('user/v1/edit', data).then(res => res.data));
}

export async function verifyTokenApi(data){
	return (axiosInstance.get('auth/v1/verify/token', {
        params: data
    }).then(res => res.data))
}

export async function setPasswordApi(data) {
	return (axiosInstance.post('auth/v1/set/password', data).then(res => res.data))
}

export async function getUnassignedUsers(data) {
	return (axiosInstance.get('user/v1/unassigned/list',  {
        params: data
    }).then(res => res.data));
}

export async function assignTeamAPI(data) {
	return (axiosInstance.patch('projects/v1/assign/users', data).then(res => res.data));
}

export async function addSectionApi(data) {
	return (axiosInstance.post('projects/v1/add/section', data).then(res => res.data));
}
