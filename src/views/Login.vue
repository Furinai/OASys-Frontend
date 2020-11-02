<template>
    <div class="login">
        <el-card class="login-body">
            <div slot="header">
                <div class="card-title">OA系统登录</div>
            </div>
            <el-form :model="user" :rules="rules" :ref="user">
                <el-form-item prop="username">
                    <el-input type="text" v-model="user.username" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="user.password" placeholder="密码"
                              @keyup.enter.native="onSubmit(user)"/>
                </el-form-item>
                <el-form-item>
                    <el-button class="button-long" type="primary" @click="onSubmit(user)" :loading="loading" round>
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {setAuth, setToken} from "@/utils/auth";
import {getUser, login} from "@/utils/api";

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
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
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
                    const params = new URLSearchParams();
                    params.append('username', user.username)
                    params.append('password', user.password)
                    login(params).then((response) => {
                        if (response && response.status === 'success') {
                            setToken(response.data)
                            getUser({username: user.username}).then(response => {
                                if (response && response.status === 'success') {
                                    setAuth(response.data)
                                    this.$router.push({name: "index"})
                                }
                            })
                            this.$message.success(response.message)
                        }
                        this.loading = false
                    })
                }
            })
        }
    }
}
</script>