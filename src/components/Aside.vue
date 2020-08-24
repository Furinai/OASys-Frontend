<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9"
                 active-text-color="#409EFF" router>
            <el-scrollbar style="height: 100%;">
                <div class="media">
                    <el-avatar v-if="auth" class="avatar" :src="auth.avatar"/>
                    <div class="media-body profile">
                        <div v-if="auth" class="username">
                            姓名：{{ auth.username }}
                        </div>
                        <div v-if="auth" class="rolename">
                            职位：{{ auth.role.name }}
                        </div>
                    </div>
                </div>
                <el-submenu index="1">
                    <template #title>
                        <i class="el-icon-menu"/>
                        <span>考勤</span>
                    </template>
                    <el-menu-item index="/sign">签到签退</el-menu-item>
                    <el-menu-item index="/sign-record">签到记录</el-menu-item>
                    <el-menu-item v-if="auth && auth.role.id>1" index="/sign-setting">签到设置</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template #title>
                        <i class="el-icon-folder"/>
                        <span>网盘</span>
                    </template>
                    <el-menu-item index="public-net-disk">公共网盘</el-menu-item>
                    <el-menu-item index="personal-net-disk">我的网盘</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template #title>
                        <i class="el-icon-tickets"/>
                        <span>请假</span>
                    </template>
                    <el-menu-item index="/ask-leave">请假</el-menu-item>
                    <el-menu-item v-if="auth && auth.role.id>1" index="/check-leave">审批请假</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template #title>
                        <i class="el-icon-user"/>
                        <span>员工管理</span>
                    </template>
                    <el-menu-item index="/add-user">添加员工</el-menu-item>
                    <el-menu-item index="/edit-user">管理员工</el-menu-item>
                </el-submenu>
            </el-scrollbar>
        </el-menu>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "Aside",
    computed: mapState([
        "auth"
    ])
}
</script>

<style scoped>
.aside {
    height: 100%;
}

.avatar {
    margin: 20px 0 10px 20px
}

.username {
    font-size: 12px;
    margin: 24px 0 5px 0;
    color: #BFCBD9;
}

.rolename {
    font-size: 12px;
    color: #BFCBD9;
}

.el-menu {
    height: 100%;
}
</style>