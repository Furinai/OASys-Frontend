import {get, post} from "./http";

export function login(data) {
    return post("/api/login", data);
}

export function logout() {
    return get("/api/logout");
}

export function getAuth() {
    return get("/api/auth");
}

export function getAttendances() {
    return get("/api/getAttendances");
}

export function getAttendance() {
    return get("/api/getAttendance");
}

export function signIn() {
    return get("/api/signIn");
}

export function signOut() {
    return get("/api/signOut");
}

export function getAttendanceTime() {
    return get("/api/getAttendanceTime");
}

export function setAttendanceTime(params) {
    return get("/api/setAttendanceTime", params);
}

export function getFiles(params) {
    return get("/api/getFiles", params);
}

export function addFolder(params) {
    return get("/api/addFolder", params);
}

export function renameFile(params) {
    return get("/api/renameFile", params);
}

export function deleteFile(data) {
    return post("/api/deleteFiles", data);
}

export function askLeave(data) {
    return post("/api/askLeave", data);
}

export function checkLeave(data) {
    return post("/api/checkLeave", data);
}

export function getLeaves(params) {
    return get("/api/getLeaves", params);
}

export function getNotices() {
    return get("/api/getNotices");
}

export function markRead(data) {
    return post("/api/markRead", data);
}

export function getUsers(params) {
    return get("/api/getUsers", params);
}

export function getRoles() {
    return get("/api/getRoles");
}

export function addUser(data) {
    return post("/api/addUser", data);
}

export function updateUser(data) {
    return post("/api/updateUser", data);
}

export function deleteUser(data) {
    return post("/api/deleteUser", data);
}

