<template>
    <div class="text-center date-picker">
        <el-date-picker v-model="range" start-placeholder="开始日期" end-placeholder="结束日期"
                        type="datetimerange" @change="handleValueChange"></el-date-picker>
    </div>
    <el-table :data="messages" tooltipEffect="light" style="width: 100%" border>
        <el-table-column prop="type" label="类型" align="center" width="100" :formatter="typeFormatter"/>
        <el-table-column prop="fullName" label="发送者" align="center" width="100"/>
        <el-table-column prop="createTime" label="发送时间" align="center" width="200"/>
        <el-table-column prop="content" label="内容" align="center" show-overflow-tooltip/>
    </el-table>
    <div class="pagination">
        <el-pagination background layout="prev, pager, next" :pager-count="5" :total="size"
                       :hide-on-single-page="true" @current-change="handlePageChange">
        </el-pagination>
    </div>
</template>

<script>
import {getMessages} from "/src/utils/api"
import dayjs from 'dayjs'

export default {
    name: "ViewChatRecord",
    data() {
        return {
            messages: [],
            size: 0,
            range: []
        }
    },
    created() {
        this.getMessages()
    },
    methods: {
        getMessages(pageNumber, start, end) {
            getMessages({pageNumber, start, end}).then(result => {
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
                const start = dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss")
                const end = dayjs(value[1]).format("YYYY-MM-DD HH:mm:ss")
                this.getMessages(0, start, end)
            } else {
                this.getMessages(0)
            }
        },
        handlePageChange(pageNum) {
            this.getMessages(pageNum - 1)
        }
    }
}
</script>

<style>
.date-picker {
    margin-bottom: 20px;
}
</style>