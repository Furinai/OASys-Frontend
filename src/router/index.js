import {createRouter, createWebHistory} from 'vue-router'
import store from '/src/store'

import Admin from "/src/layout/Admin.vue";
import Index from "/src/views/Index.vue";
import Login from "/src/views/Login.vue";
import ManageFile from "/src/views/Document/ManageFile.vue";
import ViewSharedFile from "/src/views/Document/ViewSharedFile.vue";
import ManageAnnouncement from "/src/views/Information/ManageAnnouncement.vue";
import PublishAnnouncement from "/src/views/Information/PublishAnnouncement.vue";
import ViewAttendanceRecord from "/src/views/Personnel/ViewAttendanceRecord.vue";
import ManageUser from "/src/views/Personnel/ManageUser.vue";
import CreateUser from "/src/views/Personnel/CreateUser.vue";

const routes = [
    {
        path: "/",
        component: Admin,
        children: [
            {
                path: "/",
                name: "Index",
                component: Index
            },
            {
                path: "/view-attendance-record",
                name: "ViewAttendanceRecord",
                component: ViewAttendanceRecord
            },
            {
                path: "/manage-announcement",
                name: "ManageAnnouncement",
                component: ManageAnnouncement
            },
            {
                path: "/publish-announcement",
                name: "PublishAnnouncement",
                component: PublishAnnouncement
            },
            {
                path: "/manage-file",
                name: "ManageFile",
                component: ManageFile
            },
            {
                path: "/view-shared-file",
                name: "ViewSharedFile",
                component: ViewSharedFile
            },
            {
                path: "/manage-user",
                name: "ManageUser",
                component: ManageUser
            },
            {
                path: "/create-user",
                name: "CreateUser",
                component: CreateUser
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (store.state.auth || to.name === "login") {
        next();
    } else {
        router.push({name: "login"})
    }
});

export default router
