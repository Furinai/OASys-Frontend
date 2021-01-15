import {createRouter, createWebHistory} from 'vue-router'
import store from '/src/store'

import Admin from "/src/layout/Admin.vue";
import Index from "/src/views/Index.vue";
import Login from "/src/views/Login.vue";
import ManageFile from "/src/views/File/ManageFile.vue";
import ViewSharedFile from "/src/views/File/ViewSharedFile.vue";
import ManageAnnouncement from "/src/views/Announcement/ManageAnnouncement.vue";
import PublishAnnouncement from "/src/views/Announcement/PublishAnnouncement.vue";
import ViewAttendanceRecord from "/src/views/Attendance/ViewAttendanceRecord.vue";
import PublicChat from "/src/views/Chat/PublicChat.vue";
import ViewChatRecord from "/src/views/Chat/ViewChatRecord.vue";
import ManageUser from "/src/views/User/ManageUser.vue";
import CreateUser from "/src/views/User/CreateUser.vue";

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
                path: "/public-chat",
                name: "PublicChat",
                component: PublicChat
            },
            {
                path: "/view-chat-record",
                name: "ViewChatRecord",
                component: ViewChatRecord
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
            },
            {
                path: "/dept/manage",
                name: "ManageDept",
                component: () => import('/src/views/Dept/ManageDept.vue')
            },
            {
                path: "/role/manage",
                name: "ManageRole",
                component: () => import('/src/views/Role/ManageRole.vue')
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
