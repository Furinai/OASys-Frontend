<template>
    <div class="index">
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="12">
                <el-card shadow="never">
                    <div slot="header">
                        <span>代办</span>
                    </div>
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
import {clockIn, clockOut, getAnnouncements, getAttendance} from "@/utils/api";
import {mapState} from "vuex";

export default {
    name: "Index",
    data() {
        return {
            attendance: {},
            announcements: [],
            dialogValue: "",
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
            getAttendance({userId: this.auth.id}).then(response => {
                if (response && response.status === 200) {
                    this.attendance = response.data
                }
            })
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
        },
        clockIn() {
            clockIn({userId: this.auth.id}).then(response => {
                if (response && response.status === 201) {
                    this.attendance = response.data
                    this.$message.success(response.message)
                }
            })
        },
        clockOut() {
            clockOut({userId: this.auth.id}).then(response => {
                if (response && response.status === 200) {
                    this.attendance = response.data
                    this.$message.success(response.message)
                }
            })
        }
    }
}
</script>