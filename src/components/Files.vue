<template>
    <div class="files">
        <template>
            <el-table
                    :data="files" border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="size"
                        label="大小">
                </el-table-column>
                <el-table-column
                        prop="userId"
                        label="作者">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Files"
    }
</script>

<style scoped>

</style>