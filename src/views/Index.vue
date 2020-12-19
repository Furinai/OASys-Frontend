<template>
    <el-row type="flex" justify="center" :gutter="20">
        <el-col :span="12">
            <el-card shadow="never">
                <template #header>
                    <span>代办</span>
                </template>
                <ul>
                    <li v-if="!attendance" class="list">
                        今日未签到，
                        <el-button @click="clockIn" type="text">签到</el-button>
                    </li>
                    <li v-if="attendance && !attendance.clockOutTime" class="list">
                        今日未签退，
                        <el-button @click="clockOut" type="text">签退</el-button>
                    </li>
                </ul>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card shadow="never">
                <template #header>
                    <span>公告</span>
                </template>
                <ul>
                    <li v-for="announcement in announcements" @click="viewAnnouncement(announcement)" class="list">
                        {{ announcement.title }}
                    </li>
                </ul>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible">
        <template #title>
            {{ dialogValue.title }}
        </template>
        <pre>{{ dialogValue.content }}</pre>
        <template #footer class="dialog-footer">
            更新时间：{{ dialogValue.updateTime }}
        </template>
    </el-dialog>
</template>

<script>
import {clockIn, clockOut, getAnnouncements, getAttendance} from "/src/utils/api";
import {mapState} from "vuex";

export default {
    name: "Index",
    data() {
        return {
            attendance: {},
            announcements: [],
            dialogValue: '',
            dialogVisible: false
        }
    },
    created() {
        this.getAttendance()
        this.getAnnouncements()
    },
    computed: mapState([
        "auth"
    ]),
    methods: {
        getAttendance() {
            getAttendance({userId: this.auth.id}).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                }
            })
        },
        getAnnouncements() {
            getAnnouncements({pageSize: 5}).then(result => {
                if (result.code === '0000') {
                    this.announcements = result.data.list
                }
            })
        },
        viewAnnouncement(announcement) {
            this.dialogVisible = true
            this.dialogValue = announcement
        },
        clockIn() {
            clockIn({userId: this.auth.id}).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    this.$message.success(result.message)
                }
            })
        },
        clockOut() {
            clockOut(this.attendance).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    this.$message.success(result.message)
                }
            })
        }
    }
}
</script>