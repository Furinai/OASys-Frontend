import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import Admin from "@/layout/Admin";
import Index from "@/views/Index";
import Login from "@/views/Login";
import ManageFile from "@/views/Document/ManageFile";
import ViewSharedFile from "@/views/Document/ViewSharedFile";
import ManageAnnouncement from "@/views/Information/ManageAnnouncement";
import PublishAnnouncement from "@/views/Information/PublishAnnouncement";
import ViewAttendanceRecord from "@/views/Personnel/ViewAttendanceRecord";
import ManageUser from "@/views/Personnel/ManageUser";
import CreateUser from "@/views/Personnel/CreateUser";

Vue.use(VueRouter)

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

const router = new VueRouter({
    mode: 'history',
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
