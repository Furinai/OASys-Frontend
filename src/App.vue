<template>
    <div id="app">
        <el-container>
            <Aside/>
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
    </div>
</template>
<script>
    import Aside from "./components/Aside";
    import Header from "./components/Header";

    export default {
        name: "App",
        components: {
            Aside,
            Header
        }
    }
</script>
<style>
    .el-header {
        border-bottom: 1px solid #eee;
        line-height: 50px;
        width: 100%;
    }
</style>
