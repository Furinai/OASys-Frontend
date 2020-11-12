<template>
    <div class="index">
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="12">
                <el-card shadow="never">
                    <div slot="header">
                        <span>代办</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never">
                    <div slot="header">
                        <span>公告</span>
                    </div>
                    <ul>
                        <li v-for="announcement in announcements" :key="announcement.id"
                            @click="viewAnnouncement(announcement)" class="list">
                            {{ announcement.title }}
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :title="dialogValue.title" :visible.sync="dialogVisible" width="50%">
            {{ dialogValue.content }}
            <span slot="footer" class="dialog-footer">
                更新时间：{{ dialogValue.updateTime }}
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getAnnouncements} from "@/utils/api";

export default {
    name: "Index",
    data() {
        return {
            attendances: {},
            announcements: [],
            dialogValue: "",
            dialogVisible: false
        }
    },
    created() {
        this.getAttendance()
        this.getAnnouncements()
    },
    methods: {
        getAttendance() {
        },
        getAnnouncements() {
            getAnnouncements({pageSize: 5}).then(response => {
                if (response && response.status === 200) {
                    this.announcements = response.data
                }
            })
        },
        viewAnnouncement(announcement) {
            this.dialogVisible = true
            this.dialogValue = announcement
        }
    }
}
</script>