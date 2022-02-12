import axios from 'axios'
import {ElMessage} from 'element-plus'
import {getToken, removeAuth, removeToken} from './auth'

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    timeout: 20000
})

request.interceptors.request.use(
    config => {
        const token = getToken()
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        let code = response.data.code
        if (code && code !== '0000') {
            ElMessage.error(response.data.message)
        }
        return response.data
    },
    error => {
        switch (error.response.status) {
            case 401:
                removeAuth()
                removeToken()
                location.reload()
                break
            case 400:
                ElMessage.error("参数无效")
                break
            case 403:
                ElMessage.error("权限不足")
                break
            case 404:
                ElMessage.error("资源不存在")
                break
            case 500:
                ElMessage.error("服务器内部错误")
                break
            case 503:
                ElMessage.error("服务不可用")
                break
            default:
                ElMessage.error(error.response.data.error)
        }
        return error.response.data
    }
)

export default function (config) {
    return request(config)
}