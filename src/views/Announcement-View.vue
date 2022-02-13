<template>
    <ul class="announcements">
        <li v-for="announcement in announcements" class="list"
            @click="viewAnnouncement(announcement)">
            <div class="flex-between">
                <div class="flex-start">
                    <el-icon>
                        <document/>
                    </el-icon>
                    {{ announcement.title }}
                </div>
                <div class="update-time">
                    <el-icon>
                        <time/>
                    </el-icon>
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
    <el-pagination :hide-on-single-page="true" :pager-count="5" :total="size" background class="pagination"
                   layout="prev, pager, next" @current-change="handlePageChange">
    </el-pagination>
</template>

<script>
import {getAnnouncements} from '../utils/api'

export default {
    name: "Announcement-View",
    data() {
        return {
            announcements: [],
            size: 0,
            currentPage: 1,
            dialogValue: '',
            dialogVisible: false
        }
    },
    created() {
        this.getAnnouncements()
    },
    methods: {
        getAnnouncements() {
            getAnnouncements({pageNumber: this.currentPage}).then(result => {
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
        handlePageChange(value) {
            this.currentPage = value
            this.getAnnouncements()
        }
    }
}
</script>

<style scoped>
.announcements {
    margin: 10px;
}
</style>