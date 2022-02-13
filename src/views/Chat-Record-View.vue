<template>
    <div class="text-center date-picker">
        <el-date-picker v-model="range" end-placeholder="结束日期" start-placeholder="开始日期"
                        type="datetimerange"
                        value-format="YYYY-MM-DD HH:mm:ss" @change="handleValueChange"></el-date-picker>
    </div>
    <el-table :data="messages" border style="width: 100%" tooltipEffect="light">
        <el-table-column :formatter="typeFormatter" align="center" label="类型" prop="type" width="100"/>
        <el-table-column align="center" label="发送者" prop="fullName" width="100"/>
        <el-table-column align="center" label="发送时间" prop="createTime" width="200"/>
        <el-table-column align="center" label="内容" prop="content" show-overflow-tooltip/>
    </el-table>
    <el-pagination :hide-on-single-page="true" :pager-count="5" :total="size" background class="pagination"
                   layout="prev, pager, next" @current-change="handlePageChange">
    </el-pagination>
</template>

<script>
import {getMessages} from '../utils/api'

export default {
    name: "Chat-Record-View",
    data() {
        return {
            messages: [],
            size: 0,
            currentPage: 0,
            range: []
        }
    },
    created() {
        this.getMessages()
    },
    methods: {
        getMessages(start, end) {
            getMessages({pageNumber: this.currentPage, start, end}).then(result => {
                if (result.code === '0000') {
                    this.messages = result.data.list
                    this.size = result.data.size
                }
            })
        },
        typeFormatter(row, column, cellValue) {
            switch (cellValue) {
                case 'SYSTEM':
                    return '系统'
                case 'PRIVATE':
                    return '私人'
                case 'PUBLIC':
                    return '公共'
            }
        },
        handleValueChange(value) {
            if (value) {
                this.getMessages(value[0], value[1])
            } else {
                this.getMessages()
            }
        },
        handlePageChange(value) {
            this.currentPage = value - 1
            this.getMessages()
        }
    }
}
</script>

<style scoped>
.date-picker {
    margin-bottom: 20px;
}
</style>