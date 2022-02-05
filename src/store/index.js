import {createStore} from 'vuex'
import {initAuth} from '../utils/auth'

const store = createStore({
    state: {
        auth: initAuth(),
        permissions: null
    },
    mutations: {
        setAuth(state, auth) {
            state.auth = auth
        },
        removeAuth(state) {
            state.auth = null
        },
        setPermissions(state, permissions) {
            state.permissions = permissions
        }
    },
    actions: {
        setAuth(context, auth) {
            context.commit("setAuth", auth)
        },
        removeAuth(context) {
            context.commit("removeAuth")
        },
        setPermissions(context, permissions) {
            context.commit("setPermissions", permissions)
        }
    }
})

export default store