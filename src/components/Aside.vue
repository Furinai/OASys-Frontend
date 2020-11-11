<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9"
                 active-text-color="#409EFF" router>
            <el-scrollbar style="height: 100%;">
                <el-submenu index="1">
                    <template #title>
                        <i class="el-icon-menu"/>
                        <span>网盘</span>
                    </template>
                    <el-menu-item index="/file-manager">文件管理</el-menu-item>
                    <el-menu-item index="/shared-file">共享文件</el-menu-item>
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