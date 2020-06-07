<template>
    <div class="login">
        <el-form :model="forms" :rules="rules" :ref="forms" class="login-form">
            <h3 class="title">
                OA管理系统
            </h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="forms.username" placeholder="用户名"/>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="forms.password" placeholder="密码"
                          @keyup.enter.native="onSubmit(forms)"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(forms)" :loading="load" round>登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import qs from "qs";
    import {setAuth} from "../utils/auth";
    import {getAuth, login} from "../utils/api";

    export default {
        name: "Login",
        data() {
            return {
                forms: {
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
                load: false
            }
        },
        methods: {
            onSubmit(forms) {
                this.$refs[forms].validate((valid) => {
                    if (valid) {
                        this.load = true
                        login(qs.stringify(forms)).then(response => {
                            this.load = false
                            if (response && response.status === "success") {
                                getAuth().then(response => {
                                    setAuth(response.object)
                                })
                                this.$message.success(response.message)
                                this.$router.push({name: "index"})
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login {
        background-image: url(/img/background.jpg);
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .title {
        margin: 0 auto 30px;
        text-align: center;
        color: #707070;
    }

    .login-form {
        padding: 25px 25px 5px;
        border-radius: 10px;
        background: #fff;
        width: 300px;
    }

    .el-button {
        width: 100%;
    }
</style>