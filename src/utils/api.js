import request from "@/utils/request";

export function getUser(params) {
    return request({
        url: '/user/user/' + params,
        method: 'get'
    })
}

export function getFiles(params) {
    return request({
        url: '/netdisk/net-files',
        method: 'get',
        params
    })
}

export function createFolder(data) {
    return request({
        url: '/netdisk/net-folder',
        method: 'post',
        data
    })
}

export function uploadFile(data) {
    return request({
        url: '/netdisk/net-file',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function downloadFile(params) {
    return request({
        url: '/netdisk/net-file/' + params,
        method: 'get',
    })
}

export function updateFile(data) {
    return request({
        url: '/netdisk/net-file',
        method: 'put',
        data
    })
}

export function removeFile(params) {
    return request({
        url: '/netdisk/net-file/' + params,
        method: 'delete',
    })
}

export function getAnnouncements(params) {
    return request({
        url: '/announcement/announcements',
        method: 'get',
        params
    })
}

export function createAnnouncement(data) {
    return request({
        url: '/announcement/announcement',
        method: 'post',
        data
    })
}

export function updateAnnouncement(data) {
    return request({
        url: '/announcement/announcement',
        method: 'put',
        data
    })
}

export function deleteAnnouncement(params) {
    return request({
        url: '/announcement/announcement/' + params,
        method: 'delete'
    })
}

export function getAttendance(params) {
    return request({
        url: '/attendance/attendance',
        method: 'get',
        params
    })
}

export function getAttendances(params) {
    return request({
        url: '/attendance/attendances',
        method: 'get',
        params
    })
}

export function clockIn(data) {
    return request({
        url: '/attendance/attendance',
        method: 'post',
        data
    })
}

export function clockOut(data) {
    return request({
        url: '/attendance/attendance',
        method: 'put',
        data
    })
}