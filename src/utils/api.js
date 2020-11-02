import request from "@/utils/request";

export function login(data) {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

export function logout(params) {
    return request({
        url: 'user/logout',
        method: 'get',
        params
    })
}

export function getUser(params) {
    return request({
        url: 'user/getUserByUsername',
        method: 'get',
        params
    })
}