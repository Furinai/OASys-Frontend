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
import Aside from "../components/Aside";
import Header from "../components/Header";

export default {
    name: "Admin",
    components: {
        Aside,
        Header
    }
}
</script>