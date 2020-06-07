import Vue from "vue";
import Vuex from "vuex";
import {initAuth} from "../utils/auth";

Vue.use(Vuex);

export default new Vuex.Store({
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
});
