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
    return get('/api/attendances')
}

export function getAttendance() {
    return get('/api/attendance')
}

export function signIn() {
    return get('/api/signIn')
}

export function signOut() {
    return get('/api/signOut')
}

export function addArticle(data) {
    return post('/api/article', data)
}
