<template>
    <div class="login">
        <el-card class="login-body">
            <template #header>
                <div class="card-title">OA系统登录</div>
            </template>
            <el-form ref="user" :model="user" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="user.username" placeholder="用户名" type="text"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="user.password" placeholder="密码" type="password" @keyup.enter="onSubmit('user')"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" class="button-long" round type="primary" @click="onSubmit('user')">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios'
import {getAuthUser} from '../utils/api'
import {setAuth, setToken} from '../utils/auth'
import {ElMessage} from 'element-plus'

export default {
    name: "Login",
    data() {
        return {
            user: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    {required: true, message: "请输入用户名", trigger: "blur"},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                ]
            },
            loading: false
        }
    },
    methods: {
        onSubmit(user) {
            this.$refs[user].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let auth = {username: 'linter', password: 'linter'}
                    let params = new URLSearchParams()
                    params.append('grant_type', 'password')
                    params.append('username', this.user.username)
                    params.append('password', this.user.password)
                    let baseUrl = import.meta.env.VITE_BASE_API_URL
                    axios.post(baseUrl + '/oauth/token', params, {auth}).then(response => {
                        let data = response.data
                        setToken(data.token_type + ' ' + data.access_token)
                        getAuthUser().then(result => {
                            if (result.code === '0000') {
                                setAuth(result.data)
                                this.$router.push({name: "Index"})
                            }
                        })
                    }).catch(error => {
                        if (error.response.status === 400) {
                            ElMessage.error(error.response.data.error_description)
                        } else {
                            ElMessage.error(error.message)
                        }
                    }).finally(() =>
                        this.loading = false
                    )
                }
            })
        }
    }
}
</script>

<style scoped>
.login {
    height: 100%;
    position: relative;
    background-size: cover;
    background-image: url(../assets/img/Deer.jpg);
}

.login-body {
    top: 50%;
    margin: auto;
    position: relative;
    max-width: 360px;
    transform: translateY(-50%);
}
</style>