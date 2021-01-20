<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9" active-text-color="#409EFF"
                 unique-opened router>
            <el-scrollbar style="height: 100%;">
                <el-menu-item index="0" :route="{name: 'Index'}">
                    <i class="el-icon-house"></i>
                    <template #title>首页</template>
                </el-menu-item>
                <el-submenu v-for="(category, i) in permissions" :index="i + ''">
                    <template #title>
                        <i v-if="category.icon" :class="category.icon"/>{{ category.name }}
                    </template>
                    <el-menu-item v-for="(menu, j) in category.children"
                                  :index="i + '-' + j" :route="{name: menu.routerName}">
                        <i v-if="menu.icon" :class="menu.icon"/>{{ menu.name }}
                    </el-menu-item>
                </el-submenu>
            </el-scrollbar>
        </el-menu>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: "Aside",
    computed: mapState([
        "auth",
        "permissions"
    ])
}
</script>

<style>
.aside {
    height: 100%;
}
</style>