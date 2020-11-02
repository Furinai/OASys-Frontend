import axios from 'axios'
import {Message} from 'element-ui'
import {getToken, removeAuth, removeToken} from '@/utils/auth'

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
        if (response.data.status === "error") {
            Message.error(response.data.message)
        }
        return response.data
    }
)

export default function (config) {
    return request(config).catch((error) => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    Message.error("服务器无法理解该请求！")
                    break
                case 401:
                    Message.error("未经授权或授权已过期！").then(() => {
                        removeAuth()
                        removeToken()
                        location.reload()
                    })
                    break
                case 403:
                    Message.error("没有权限进行此操作！")
                    break
                case 404:
                    Message.error("没有找到请求的资源！")
                    break
                case 405:
                    Message.error("不允许此请求方法！")
                    break
                case 500:
                    Message.error("服务器内部错误！")
                    break
                case 503:
                    Message.error("服务器暂时不可用！")
                    break
                case 504:
                    Message.error("网关超时！")
                    break
                default:
                    Message.error(error.response.statusText)
            }
        } else if (error.request) {
            Message.error("没有收到服务器响应！")
        } else {
            Message.error("生成请求发生错误！")
        }
    })
}