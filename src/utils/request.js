import axios from 'axios'
import {ElMessage } from 'element-plus'
import {getToken, removeAuth, removeToken} from '/src/utils/auth'

const request = axios.create({
    baseURL: '/api',
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
        if (response.data.code >= 400) {
            ElMessage .error(response.data.message)
        }
        return response.data
    }
)

export default function (config) {
    return request(config).catch((error) => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    ElMessage .error("请求参数不正确！")
                    break
                case 401:
                    ElMessage .error("未授权或授权过期！").then(() => {
                        removeAuth()
                        removeToken()
                        location.reload()
                    })
                    break
                case 403:
                    ElMessage .error("没有权限进行此操作！")
                    break
                case 404:
                    ElMessage .error("没有找到请求的资源！")
                    break
                case 500:
                    ElMessage .error("服务器内部错误！")
                    break
                case 503:
                    ElMessage .error("服务暂不可用！")
                    break
                default:
                    ElMessage .error(error.response.statusText)
            }
        } else if (error.request) {
            ElMessage .error("没有收到服务器响应！")
        } else {
            ElMessage .error("生成请求时发生错误！")
        }
    })
}