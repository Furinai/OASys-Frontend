import request from "@/utils/request";

export function getUser(params) {
    return request({
        url: '/auth/user/' + params,
        method: 'get'
    })
}

export function getAttendance(params) {
    return request({
        url: '/pers/attendance',
        method: 'get',
        params
    })
}

export function getAttendances(params) {
    return request({
        url: '/pers/attendances',
        method: 'get',
        params
    })
}

export function clockIn(data) {
    return request({
        url: '/pers/attendance',
        method: 'post',
        data
    })
}

export function clockOut(data) {
    return request({
        url: '/pers/attendance',
        method: 'put',
        data
    })
}

export function deleteDossiers(params) {
    return request({
        url: '/pers/dossiers',
        method: 'get',
        params
    })
}

export function getAnnouncements(params) {
    return request({
        url: '/info/announcements',
        method: 'get',
        params
    })
}

export function createAnnouncement(data) {
    return request({
        url: '/info/announcement',
        method: 'post',
        data
    })
}

export function updateAnnouncement(data) {
    return request({
        url: '/info/announcement',
        method: 'put',
        data
    })
}

export function deleteAnnouncement(params) {
    return request({
        url: '/info/announcement/' + params,
        method: 'delete'
    })
}

export function getFiles(params) {
    return request({
        url: '/doc/files',
        method: 'get',
        params
    })
}

export function uploadFile(data) {
    return request({
        url: '/doc/file',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function downloadFile(params) {
    return request({
        url: '/doc/file/' + params,
        method: 'get',
        responseType: 'blob'
    })
}

export function updateFile(data) {
    return request({
        url: '/doc/file',
        method: 'put',
        data
    })
}

export function createFolder(data) {
    return request({
        url: '/doc/folder',
        method: 'post',
        data
    })
}

export function deleteFile(params) {
    return request({
        url: '/doc/file/' + params,
        method: 'delete',
    })
}

export function getUsers(params) {
    return request({
        url: '/pers/users',
        method: 'get',
        params
    })
}

export function createUser(data) {
    return request({
        url: '/pers/user',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/pers/user',
        method: 'put',
        data
    })
}

export function deleteUser(params) {
    return request({
        url: '/pers/user/' + params,
        method: 'delete'
    })
}

export function getDepts() {
    return request({
        url: '/pers/depts',
        method: 'get'
    })
}

export function uploadProfilePicture(data) {
    return request({
        url: '/doc/profile-picture',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}