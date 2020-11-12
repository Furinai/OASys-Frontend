import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import Admin from "@/layout/Admin";
import Index from "@/views/Index";
import Login from "@/views/Login";
import ManageFile from "@/views/NetFile/ManageFile";
import ViewSharedFile from "@/views/NetFile/ViewSharedFile";
import ManageAnnouncement from "@/views/Announcement/ManageAnnouncement";
import PublishAnnouncement from "@/views/Announcement/PublishAnnouncement";
import ViewAttendanceRecord from "@/views/Attendance/ViewAttendanceRecord";

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
                path: "/view-attendance-record",
                name: "ViewAttendanceRecord",
                component: ViewAttendanceRecord
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
