import axios from "axios";
import {initAuth, removeAuth} from "./auth";
import {Message, MessageBox} from "element-ui";
import router from "../router";

axios.interceptors.request.use(
    config => {
        config.timeout = 4000;
        return config
    },
    error => {
        MessageBox.alert(error);
        Promise.reject(error)
    }
);

axios.interceptors.response.use(
    response => {
        if (response.data.status === "error") {
            Message.error(response.data.message)
        }
        return response.data
    },
    error => {
        switch (error.response.status) {
            case 401:
                if (initAuth() != null) {
                    Message.error(error.response.data.message);
                    router.push({name: "login"});
                    removeAuth();
                }
                break;
            case 403:
                Message.error(error.response.data.message);
                break;
            default:
                Message.error(error.response.statusText);
        }
    }
);

export function get(url, params) {
    return axios({
        url,
        params,
        method: "get",
    })
}

export function post(url, data) {
    return axios({
        url,
        data,
        method: "post",
    })
}