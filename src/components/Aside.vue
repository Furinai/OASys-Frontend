<template>
    <div class="aside">
        <el-menu>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"/>
                </template>
                <span slot="title">分组一</span>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
                <el-menu-item index="1-3">选项3</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"/>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-document"/>
                <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-setting"/>
                <span slot="title">导航四</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Aside",
    }
</script>

<style scoped>
</style>