import request from "/src/utils/request";

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

export function deleteAnnouncement(params) {
    return request({
        url: '/announcements/' + params,
        method: 'delete'
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

export function downloadFile(params) {
    return request({
        url: '/files/' + params,
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

export function deleteFile(params) {
    return request({
        url: '/files/' + params,
        method: 'delete',
    })
}

export function getUser(params) {
    return request({
        url: '/users/' + params,
        method: 'get'
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

export function deleteUser(params) {
    return request({
        url: '/users/' + params,
        method: 'delete'
    })
}

export function getDepts() {
    return request({
        url: '/depts',
        method: 'get'
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