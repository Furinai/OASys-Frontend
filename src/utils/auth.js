import store from '../store'

export function initAuth() {
    return JSON.parse(localStorage.getItem("auth"))
}

export function setAuth(auth) {
    store.dispatch("setAuth", auth).then(
        () => localStorage.setItem("auth", JSON.stringify(auth))
    )
}

export function removeAuth() {
    store.dispatch("removeAuth").then(
        () => localStorage.removeItem("auth")
    )
}

export function getToken() {
    return localStorage.getItem("token")
}

export function setToken(token) {
    localStorage.setItem("token", token)
}

export function removeToken() {
    localStorage.removeItem("token")
}