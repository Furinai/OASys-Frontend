<template>
    <div class="header">
        <ul class="nav-list">
            <li v-if="auth" class="nav">
                欢迎您，{{ auth.username }}，
            </li>
            <notice/>
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
import {logout} from "../utils/api";
import {removeAuth} from "../utils/auth";
import Notice from "./Notice";

export default {
    name: "Header",
    components: {Notice},
    computed: mapState([
        "auth"
    ]),
    methods: {
        logout() {
            this.$confirm("确定注销？", "提示", {type: "warning",}).then(() => {
                logout().then(response => {
                    if (response && response.status === "success") {
                        removeAuth()
                        this.$router.push({name: "login"})
                        this.$message.success(response.message)
                    }
                })
            }).catch(() => {
                this.$message.warning("已取消！")
            })
        }
    },
}
</script>

<style scoped>
.header {
    display: flex;
    margin: auto;
}

.nav-list {
    margin-left: auto;
    display: flex;
}

.nav {
    margin-left: 10px;
}

a {
    color: #707070;
}
</style>