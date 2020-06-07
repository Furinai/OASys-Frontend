import store from "../store";

export function initAuth() {
    const auth = localStorage.getItem("auth");
    return JSON.parse(auth)
}

export function setAuth(auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
    store.dispatch("setAuth", auth)
}

export function removeAuth() {
    localStorage.removeItem("auth");
    store.dispatch("removeAuth")
}