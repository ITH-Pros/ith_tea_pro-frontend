import { axiosInstance } from './../../config/https'

export function addRating(data) {
  return axiosInstance.post('/rating/v1/user/insert', data).then(res => res.data)
}

export function addNewUserDetail(data) {
  return axiosInstance.post('/user/v1/add/', data).then(res => res.data)
}

export function getUserDetailsByUserId(data) {
  return axiosInstance.get('/user/v1/userId', data).then(res => res.data)
}

export async function getAllUsers(data) {
  return axiosInstance.get('/user/v1/all/pagination', data).then(res => res.data)
}

export async function fetchTeamList(data) {
  return axiosInstance.get('/user/v1/all/manager/users', data).then(res => res.data)
}

export async function getAllUserWithoutPagination(data) {
  return axiosInstance.get('/user/v1/list', data).then(res => res.data)
}

export async function getAllLeadsWithoutPagination(data) {
  return axiosInstance.get('/user/v1/leads/list', data).then(res => res.data)
}

export async function getAllUserDataForRating(data) {
  return axiosInstance.get('/user/v1/list', data).then(res => res.data)
}

export async function getAllProjects(data) {
  return axiosInstance.get('/projects/v1/all', { params: data }).then(res => res.data)
}

export async function getAllCategories(data) {
  return axiosInstance.get('/projects/v1/categories', { params: data }).then(res => res.data)
}

export async function getAllUsersWithoutPagination(data) {
  return axiosInstance.get('/user/v1/all', { params: data }).then(res => res.data)
}
export async function getAllUsersWithAdmin(data) {
  return axiosInstance.get('/user/v1/all/users').then(res => res.data)
}

export async function getAllMyWorks(data) {
  return axiosInstance.get('/task/v1/list/homepage', { params: data }).then(res => res.data)
}

export async function getAllLeads(data) {
  return axiosInstance.get('/user/v1/all/leads').then(res => res.data)
}
export async function getOverDueTaskListData(data) {
  return axiosInstance.get('/task/v1/overdue/tasks', { params: data }).then(res => res.data)
}

export async function getAllPendingRating(data) {
  return axiosInstance.get('/task/v1/list/pending/rating', { params: data }).then(res => res.data)
}

export async function getAllAssignedProject(data) {
  return axiosInstance.get('/projects/v1/list/assigned', { params: data }).then(res => res.data)
}

export async function getUserAssignedProjects(data) {
  return axiosInstance.get('/projects/v1/user/assigned', data).then(res => res.data)
}

export async function assignUserToProject(data) {
  return axiosInstance.patch('/projects/v1/assign/users', data).then(res => res.data)
}
export async function assignUserToProjectByIds(data) {
  return axiosInstance.patch('projects/v1/assign/projects', data).then(res => res.data)
}

export async function deleteUserById(data) {
  return axiosInstance.patch('user/v1/delete/user', data).then(res => res.data)
}

export async function deleteProjectById(data) {
  return axiosInstance.patch('/projects/v1/delete', data).then(res => res.data)
}

export async function archiveProjectById(data) {
  return axiosInstance.patch('projects/v1/update/archive', data).then(res => res.data)
}

export async function addNewProject(data) {
  return axiosInstance.post('/projects/v1/add/new', data).then(res => res.data)
}

export async function resendActivationLinkApi(data) {
  return axiosInstance.post('auth/v1/resend/password/setup', data).then(res => res.data)
}

export async function updateProjectForm(data) {
  return axiosInstance.patch('/projects/v1/edit', data).then(res => res.data)
}

export async function updateUserRating(data) {
  return axiosInstance.patch('/rating/v1/user/update', data).then(res => res.data)
}

export async function getProjectsTask(data) {
  return axiosInstance
    .get('/task/v1/groupby', {
      params: data,
    })
    .then(res => res.data)
}

export async function downloadExcel(data) {
  return axiosInstance
    .get('/task/v1/downloadExcel', {
      params: data,
      responseType: 'arraybuffer',
    })
    .then(res => res.data)
}

export async function archiveSectionApi(data) {
  return axiosInstance.patch('projects/v1/archive/section', data).then(res => res.data)
}

export async function updateSection(data) {
  return axiosInstance.patch('projects/v1/edit/section', data).then(res => res.data)
}

export async function deleteSectionApi(data) {
  return axiosInstance.patch('projects/v1/delete/section', data).then(res => res.data)
}

export async function getTaskDetailsByProjectId(data) {
  return axiosInstance.get('task/v1/list/for/rating', { params: data }).then(res => res.data)
}

export async function getTaskDetailsByTaskId(data) {
  return axiosInstance.get('/task/v1/by/taskId', data).then(res => res.data)
}

export async function updateTaskDetails(data) {
  return axiosInstance.patch('/task/v1/edit', data).then(res => res.data)
}

export async function deleteTaskDetails(data) {
  return axiosInstance.patch('/task/v1/delete', data).then(res => res.data)
}

export async function createTask(data) {
  return axiosInstance.post('/task/v1/user/insert', data).then(res => res.data)
}

export async function getTaskStatusAnalytics(data) {
  return axiosInstance.get('/task/v1/status/analytics', data).then(res => res.data)
}

export function addCommentOnTaskById(data) {
  return axiosInstance.post('/comment/v1/user/task/insert', data).then(res => res.data)
}

export async function getRatings(data) {
  return axiosInstance
    .get('rating/v1/month/all/user', {
      params: data,
    })
    .then(res => res.data)
}

export async function getRatingsByUser(data) {
  return axiosInstance
    .get('analytics/v1/all/rating', {
      params: data,
    })
    .then(res => res.data)
}

export async function getRatingsDetailsByID(data) {
  return axiosInstance
    .get('rating/v1/day/rating', {
      params: data,
    })
    .then(res => res.data)
}

export async function getLogedInUserDetails(data) {
  return axiosInstance.get('user/v1/userId', data).then(res => res.data)
}

export async function editLogedInUserDetails(data) {
  return axiosInstance.patch('user/v1/edit', data).then(res => res.data)
}

export async function verifyTokenApi(data) {
  return axiosInstance
    .get('auth/v1/verify/token', {
      params: data,
    })
    .then(res => res.data)
}

export async function setPasswordApi(data) {
  return axiosInstance.post('auth/v1/set/password', data).then(res => res.data)
}

export async function uploadProfileImage(data) {
  return axiosInstance.put('upload/v1/upload/file', data).then(res => res.data)
}

export async function getUnassignedUsers(data) {
  return axiosInstance
    .get('user/v1/unassigned/list', {
      params: data,
    })
    .then(res => res.data)
}

export async function assignTeamAPI(data) {
  return axiosInstance.patch('projects/v1/assign/users', data).then(res => res.data)
}

export async function assignProjectLead(data) {
  return axiosInstance.patch('projects/v1/assign/leads', data).then(res => res.data)
}

export async function addSectionApi(data) {
  return axiosInstance.post('projects/v1/add/section', data).then(res => res.data)
}

export async function getProjectById(data) {
  return axiosInstance
    .get('projects/v1/categories', {
      params: data,
    })
    .then(res => res.data)
}
export async function getProjectByProjectId(data) {
  return axiosInstance
    .get('projects/v1/project/users/for/rating', {
      params: data,
    })
    .then(res => res.data)
}
export async function getLeadsUsingProjectId(data) {
  return axiosInstance
    .get('projects/v1/project/leads', {
      params: data,
    })
    .then(res => res.data)
}
export async function getUserUsingProjectId(data) {
  return axiosInstance
    .get('projects/v1/project/users', {
      params: data,
    })
    .then(res => res.data)
}

export async function updateTaskStatusById(data) {
  return axiosInstance.patch('task/v1/update/status', data).then(res => res.data)
}

export async function getTeamWork(data) {
  return axiosInstance
    .get('task/v1/get/today/tasks', {
      params: data,
    })
    .then(res => res.data)
}

export async function taskById(data) {
  return axiosInstance
    .get('/task/v1/by/taskId', {
      params: data,
    })
    .then(res => res.data)
}

export async function addCommentOnTask(data) {
  return axiosInstance.post('task/v1/add/comment', data).then(res => res.data)
}

export async function addRatingOnTask(data) {
  return axiosInstance.post('rating/v1/user/insert', data).then(res => res.data)
}

export async function getUserAnalytics(data) {
  return axiosInstance
    .get('user/v1/team/analytics', {
      params: data,
    })
    .then(res => res.data)
}

export async function getTaskHistoryById(data) {
  return axiosInstance
    .get('tasklogs/v1/get', {
      params: data,
    })
    .then(res => res.data)
}

export async function removeUserFromProject(data) {
  return axiosInstance.patch('projects/v1/remove/users', data).then(res => res.data)
}

export async function getUserReportData(data) {
  return axiosInstance
    .get('task/v1/get/team/task', {
      params: data,
    })
    .then(res => res.data)
}

export async function updateTaskRating(data) {
  return axiosInstance.patch('task/v1/rate/updateRating', data).then(res => res.data)
}

export async function addGuestApi(data) {
  return axiosInstance.post('/user/v1/addGuest', data).then(res => res.data)
}

export async function editGuestApi(data) {
  return axiosInstance.patch('guest/v1/edit', data).then(res => res.data)
}

export async function getGuestApi(data) {
  return axiosInstance
    .get('user/v1/guest/pagination', {
      params: data,
    })
    .then(res => res.data)
}

export async function deleteGuestApi(data) {
  return axiosInstance.patch('user/v1/delete/user', data).then(res => res.data)
}

export async function changeGuestStatus(data) {
  return axiosInstance.patch('user/v1/active/guest', data).then(res => res.data)
}

export async function reopenTaskById(data) {
  return axiosInstance.post('task/v1/reopen', data).then(res => res.data)
}

export async function getAllManager(data) {
  return axiosInstance
    .get('user/v1/leads/list', {
      params: data,
    })
    .then(res => res.data)
}

export async function assignManagerTOUserByIds(data) {
  return axiosInstance.patch('user/v1/assign/manager', data).then(res => res.data)
}

export async function verifyTaskById(data) {
  return axiosInstance.patch('task/v1/verify', data).then(res => res.data)
}

export async function getRatingList(data) {
  return axiosInstance.get('/v1/list/for/rating', { params: data }).then(res => res.data)
}

export async function verifyManager(data) {
  return axiosInstance.get('user/v1/verify/manager', { params: data }).then(res => res.data)
}

export async function getUsersByProject() {
  return axiosInstance.get('task/v1/get/today/taskCreatedUsers').then(res => res.data)
}

export async function getFreeUsers() {
  return axiosInstance.get('task/v1/get/today/freeUsers').then(res => res.data)
}