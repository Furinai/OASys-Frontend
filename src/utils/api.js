import request from '../utils/request'

export function getAuthUser() {
    return request({
        url: '/oauth/user',
        method: 'get'
    })
}

export function getAuthPermissionsOfUser() {
    return request({
        url: '/oauth/user/permissions',
        method: 'get'
    })
}

export function getAttendances(params) {
    return request({
        url: '/attendances',
        method: 'get',
        params
    })
}

export function clockIn(params) {
    return request({
        url: '/attendances',
        method: 'post',
        params
    })
}

export function clockOut(params) {
    return request({
        url: '/attendances',
        method: 'put',
        params
    })
}

export function getAnnouncements(params) {
    return request({
        url: '/announcements',
        method: 'get',
        params
    })
}

export function createAnnouncement(data) {
    return request({
        url: '/announcements',
        method: 'post',
        data
    })
}

export function updateAnnouncement(data) {
    return request({
        url: '/announcements',
        method: 'put',
        data
    })
}

export function deleteAnnouncement(pathVariable) {
    return request({
        url: '/announcements/' + pathVariable,
        method: 'delete'
    })
}

export function getMessages(params) {
    return request({
        url: '/messages',
        method: 'get',
        params
    })
}

export function getFiles(params) {
    return request({
        url: '/files',
        method: 'get',
        params
    })
}

export function uploadFile(data) {
    return request({
        url: '/files',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function downloadFile(pathVariable) {
    return request({
        url: '/files/' + pathVariable,
        method: 'get',
        responseType: 'blob'
    })
}

export function updateFile(data) {
    return request({
        url: '/files',
        method: 'put',
        data
    })
}

export function createFolder(data) {
    return request({
        url: '/files',
        method: 'post',
        data
    })
}

export function deleteFile(pathVariable) {
    return request({
        url: '/files/' + pathVariable,
        method: 'delete',
    })
}

export function getUsers(params) {
    return request({
        url: '/users',
        method: 'get',
        params
    })
}

export function createUser(data) {
    return request({
        url: '/users',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/users',
        method: 'put',
        data
    })
}

export function deleteUser(pathVariable) {
    return request({
        url: '/users/' + pathVariable,
        method: 'delete'
    })
}

export function getDepts() {
    return request({
        url: '/depts',
        method: 'get'
    })
}

export function createDept(data) {
    return request({
        url: '/depts',
        method: 'post',
        data
    })
}

export function updateDept(data) {
    return request({
        url: '/depts',
        method: 'put',
        data
    })
}

export function deleteDept(pathVariable) {
    return request({
        url: '/depts/' + pathVariable,
        method: 'delete'
    })
}

export function getRoles() {
    return request({
        url: '/roles',
        method: 'get'
    })
}

export function createRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: '/roles',
        method: 'put',
        data
    })
}

export function deleteRole(pathVariable) {
    return request({
        url: '/roles/' + pathVariable,
        method: 'delete'
    })
}

export function getPermissionsOfRole(pathVariable) {
    return request({
        url: '/roles/' + pathVariable + '/permissions',
        method: 'get'
    })
}

export function createPermissionsToRole(pathVariable, data) {
    return request({
        url: '/roles/' + pathVariable + '/permissions',
        method: 'post',
        data
    })
}

export function updatePermissionsOfRole(pathVariable, data) {
    return request({
        url: '/roles/' + pathVariable + '/permissions',
        method: 'put',
        data
    })
}

export function getPermissions(params) {
    return request({
        url: '/permissions',
        method: 'get',
        params
    })
}

export function createPermission(data) {
    return request({
        url: '/permissions',
        method: 'post',
        data
    })
}

export function updatePermission(data) {
    return request({
        url: '/permissions',
        method: 'put',
        data
    })
}

export function deletePermission(pathVariable) {
    return request({
        url: '/permissions/' + pathVariable,
        method: 'delete'
    })
}

export function uploadProfilePicture(data) {
    return request({
        url: '/profile-pictures',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function searchFile(params) {
    return request({
        url: '/searches/files',
        method: 'get',
        params
    })
}