import {get, post} from './http'

export function login(data) {
    return post('/api/login', data)
}

export function logout() {
    return get('/api/logout')
}

export function getAuth() {
    return get('/api/auth')
}

export function getAttendances() {
    return get('/api/getAttendances')
}

export function getAttendance() {
    return get('/api/getAttendance')
}

export function signIn() {
    return get('/api/signIn')
}

export function signOut() {
    return get('/api/signOut')
}

export function getAttendanceTime() {
    return get('/api/getAttendanceTime')
}

export function setAttendanceTime(params) {
    return get('/api/setAttendanceTime', params)
}

export function getFiles(params) {
    return get('/api/getFiles', params)
}

export function addFolder(params) {
    return get('/api/addFolder', params)
}
