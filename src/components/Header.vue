<template>
    <div class="header">
        <ul class="nav-list">
            <li v-if="auth" class="nav">
                欢迎，{{ auth.name }}，
            </li>
            <li class="nav">
                <a href="javascript:" @click="logout">
                    退出登录
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {removeAuth, removeToken} from "../utils/auth";

export default {
    name: "Header",
    computed: mapState([
        "auth"
    ]),
    methods: {
        logout() {
            this.$confirm("确定注销？", "提示", {type: "warning",}).then(() => {
                    removeAuth()
                    removeToken()
                    this.$router.push({name: "login"})
                }
            ).catch(() => {
                this.$message.warning("已取消！")
            })
        }
    },
}
</script>