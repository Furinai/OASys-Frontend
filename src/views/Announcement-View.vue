<template>
    <ul class="announcements">
        <li class="list" v-for="announcement in announcements"
            @click="viewAnnouncement(announcement)">
            <div class="flex-between">
                <div class="flex-start">
                    <i class="el-icon-document"></i>
                    {{ announcement.title }}
                </div>
                <div class="update-time">
                    <i class="el-icon-time"></i>
                    {{ announcement.createTime }}
                </div>
            </div>
        </li>
    </ul>
    <el-dialog v-model="dialogVisible">
        <template #title>
            {{ dialogValue.title }}
        </template>
        <pre>{{ dialogValue.content }}</pre>
        <template #footer class="dialog-footer">
            更新时间：{{ dialogValue.updateTime }}
        </template>
    </el-dialog>
    <div class="pagination">
        <el-pagination background layout="prev, pager, next" :pager-count="5" :total="size"
                       :hide-on-single-page="true" @current-change="handlePageChange">
        </el-pagination>
    </div>
</template>

<script>
import {getAnnouncements} from '/@/utils/api'

export default {
    name: "Announcement-View",
    data() {
        return {
            announcements: [],
            dialogValue: '',
            dialogVisible: false,
            size: 0
        }
    },
    created() {
        this.getAnnouncements()
    },
    methods: {
        getAnnouncements(pageNumber) {
            getAnnouncements({pageNumber}).then(result => {
                if (result.code === '0000') {
                    this.announcements = result.data.list
                    this.size = result.data.size
                }
            })
        },
        viewAnnouncement(announcement) {
            this.dialogVisible = true
            this.dialogValue = announcement
        },
        handlePageChange(pageNum) {
            this.getAnnouncements(pageNum)
        }
    }
}
</script>

<style>
.announcements {
    margin: 10px;
}
</style>