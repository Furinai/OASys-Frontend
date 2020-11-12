<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9" active-text-color="#409EFF"
                 unique-opened router>
            <el-scrollbar style="height: 100%;">
                <el-menu-item index="1" :route="{name: 'Index'}">
                    <i class="el-icon-house"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu index="2">
                    <template #title>
                        <i class="el-icon-box"/>
                        <span>网盘</span>
                    </template>
                    <el-menu-item index="2-1" :route="{name: 'ManageFile'}">文件管理</el-menu-item>
                    <el-menu-item index="2-2" :route="{name: 'ViewSharedFile'}">共享文件</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template #title>
                        <i class="el-icon-bell"/>
                        <span>公告</span>
                    </template>
                    <el-menu-item index="2-1" :route="{name: 'ManageAnnouncement'}">公告管理</el-menu-item>
                    <el-menu-item index="2-2" :route="{name: 'PublishAnnouncement'}">发布公告</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template #title>
                        <i class="el-icon-date"/>
                        <span>考勤</span>
                    </template>
                    <el-menu-item index="4-1" :route="{name: 'ViewAttendanceRecord'}">打卡记录</el-menu-item>
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