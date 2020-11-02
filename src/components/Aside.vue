<template>
    <div class="aside">
        <el-menu background-color="#304156" text-color="#BFCBD9"
                 active-text-color="#409EFF" router>
            <el-scrollbar style="height: 100%;">
                <el-submenu index="1">
                    <template #title>
                        <i class="el-icon-menu"/>
                        <span>考勤</span>
                    </template>
                    <el-menu-item index="/sign">签到签退</el-menu-item>
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