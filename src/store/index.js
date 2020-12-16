import {createStore} from 'vuex'
import {initAuth} from "/src/utils/auth";

const store = createStore({
    state: {
        auth: initAuth()
    },
    mutations: {
        setAuth(state, auth) {
            state.auth = auth;
        },
        removeAuth(state) {
            state.auth = null;
        }
    },
    actions: {
        setAuth(context, auth) {
            context.commit("setAuth", auth);
        },
        removeAuth(context) {
            context.commit("removeAuth");
        }
    }
})

export default store;