<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9" active-text-color="#409EFF"
                 unique-opened router>
            <el-scrollbar style="height: 100%;">
                <el-menu-item index="1" :route="{name: 'Index'}">
                    <i class="el-icon-house"></i>
                    <template #title>首页</template>
                </el-menu-item>
                <el-submenu index="2">
                    <template #title>
                        <i class="el-icon-date"/>
                        <span>考勤</span>
                    </template>
                    <el-menu-item index="2-1" :route="{name: 'ViewAttendanceRecord'}">打卡记录</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template #title>
                        <i class="el-icon-bell"/>
                        <span>公告</span>
                    </template>
                    <el-menu-item index="3-1" :route="{name: 'ManageAnnouncement'}">公告管理</el-menu-item>
                    <el-menu-item index="3-2" :route="{name: 'PublishAnnouncement'}">发布公告</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template #title>
                        <i class="el-icon-chat-round"/>
                        <span>聊天</span>
                    </template>
                    <el-menu-item index="4-1" :route="{name: 'PublicChat'}">公共聊天</el-menu-item>
                    <el-menu-item index="4-2" :route="{name: 'ViewChatRecord'}">聊天记录</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template #title>
                        <i class="el-icon-box"/>
                        <span>网盘</span>
                    </template>
                    <el-menu-item index="5-1" :route="{name: 'ManageFile'}">文件管理</el-menu-item>
                    <el-menu-item index="5-2" :route="{name: 'ViewSharedFile'}">共享文件</el-menu-item>
                </el-submenu>
                <el-submenu index="6">
                    <template #title>
                        <i class="el-icon-user"/>
                        <span>人事</span>
                    </template>
                    <el-menu-item index="6-1" :route="{name: 'ManageUser'}">用户管理</el-menu-item>
                    <el-menu-item index="6-2" :route="{name: 'CreateUser'}">添加用户</el-menu-item>
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