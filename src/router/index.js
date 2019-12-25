import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "../views/Index";
import NotFound from "../views/NotFound";

Vue.use(VueRouter);

const routes = [
    {
        name: 'index',
        path: '/',
        component: Index
    },
    {
        path: '*',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
