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
import {clockIn, clockOut, getAnnouncements, getAttendances} from '/@/utils/api'
import {mapState} from 'vuex'

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
        //this.getAttendances()
        //this.getAnnouncements()
    },
    computed: mapState([
        "auth"
    ]),
    methods: {
        getAttendances() {
            let date = new Date()
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate()
            getAttendances({userId: this.auth.id, year, month, day}).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data[0]
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
            clockIn(this.auth.id).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    let minutes = this.attendance.comeLateMinutes
                    if (minutes) {
                        this.$message.success('签到成功，迟到' + minutes + '分钟')
                    } else {
                        this.$message.success('签到成功')
                    }
                }
            })
        },
        clockOut() {
            clockOut(this.attendance.id).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    let minutes = this.attendance.leaveEarlyMinutes
                    if (minutes) {
                        this.$message.success('签退成功，早退' + minutes + '分钟')
                    } else {
                        this.$message.success('签退成功')
                    }
                }
            })
        }
    }
}
</script>