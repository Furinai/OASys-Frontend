import store from '../store'
import {createRouter, createWebHistory} from 'vue-router'
import {getAuthPermissionsOfUser} from "../utils/api";

import Admin from '../layout/Admin.vue'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/',
        name: 'Admin',
        component: Admin,
        children: [
            {
                path: '/',
                name: 'Index',
                component: Index
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/:pathMatch(.*)',
        component: Index
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

function setPermissions(routerPath) {
    getAuthPermissionsOfUser().then(result => {
        store.dispatch('setPermissions', result.data).then(() => {
            if (result.code === '0000') {
                let permissions = result.data
                for (let i = 0; i < permissions.length; i++) {
                    let routerDefinitions = permissions[i].children
                    if (routerDefinitions && routerDefinitions.length > 0) {
                        for (let j = 0; j < routerDefinitions.length; j++) {
                            let path = routerDefinitions[j].componentPath
                            router.addRoute('Admin', {
                                path: routerDefinitions[j].routerPath,
                                name: routerDefinitions[j].routerName,
                                component: () => import(`../views/${path}.vue`)
                            })
                        }
                    }
                }
                router.push(routerPath)
            }
        })
    })
}

router.beforeEach((to) => {
    if (to.name !== 'login') {
        if (!store.state.auth) {
            router.push({name: 'login'})
            return false
        }
        if (!store.state.permissions) {
            setPermissions(to.path)
            return false
        }
    }
})

export default router