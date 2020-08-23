<template>
    <el-row type="flex" justify="center">
        <el-col :xs="18" :sm=6>
            <img class="image" src="/img/notfound.png" alt="NotFound">
            <div class="text">
                页面不存在。
                <router-link :to="{ name: 'index' }">
                    返回首页
                </router-link>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "NotFound"
}
</script>
<style scoped>
.image {
    width: 100%;
    margin: 100px 0;
}

.text {
    font-size: 20px;
    text-align: center;
}

.text a {
    color: #409EFF;
}
</style>