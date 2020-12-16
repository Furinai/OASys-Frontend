<template>
    <el-container>
        <el-aside width="220px">
            <Aside/>
        </el-aside>
        <el-container>
            <el-header>
                <Header/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Aside from "/src/components/Aside.vue";
import Header from "/src/components/Header.vue";

export default {
    name: "Admin",
    components: {
        Aside,
        Header
    }
}
</script>