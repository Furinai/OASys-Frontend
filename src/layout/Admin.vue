<template>
    <el-container>
        <el-aside width="220px">
            <Aside/>
        </el-aside>
        <el-container>
            <el-header height="50px">
                <Header/>
            </el-header>
            <el-main>
                <keep-alive>
                    <router-view/>
                </keep-alive>
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

<style scoped>
    .el-header {
        border-bottom: 1px solid #eee;
        line-height: 50px;
        width: 100%;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
    }
    .el-container{
        height: 100%;
    }
</style>