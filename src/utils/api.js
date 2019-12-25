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

export function addArticle(data) {
    return post('/api/article', data)
}
