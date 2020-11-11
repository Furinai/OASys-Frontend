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

export function update(data) {
    return request({
        url: '/netdisk/net-file',
        method: 'put',
        data
    })
}


export function remove(params) {
    return request({
        url: '/netdisk/net-file/' + params,
        method: 'delete',
    })
}