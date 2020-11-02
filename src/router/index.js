import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import Admin from "@/layout/Admin";
import Index from "@/views/Index";
import Login from "@/views/Login";

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: Admin,
        children: [
            {
                path: "/",
                name: "index",
                component: Index
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
