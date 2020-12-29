<template>
    <div class="login">
        <el-card class="login-body">
            <template #header>
                <div class="card-title">OA系统登录</div>
            </template>
            <el-form :model="user" :rules="rules" ref="user">
                <el-form-item prop="username">
                    <el-input type="text" v-model="user.username" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="user.password" placeholder="密码" @keyup.enter="onSubmit('user')"/>
                </el-form-item>
                <el-form-item>
                    <el-button class="button-long" type="primary" @click="onSubmit('user')" :loading="loading" round>
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios'
import {getUser} from "/src/utils/api";
import {setAuth, setToken} from "/src/utils/auth";

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
                    axios.post('/api/oauth/token', params, {auth}).then(response => {
                        let data = response.data
                        setToken(data.token_type + ' ' + data.access_token)
                        getUser(this.user.username).then(result => {
                            if (result.code === '0000') {
                                setAuth(result.data)
                                this.$router.push({name: "Index"})
                            }
                        })
                    }).catch(error => {
                        this.$message.error(error.response.data.error_description)
                    }).finally(() =>
                        this.loading = false
                    )
                }
            })
        }
    }
}
</script>