<template>
    <div class="sign">
        <div class="time">{{ currentTime | formatTime }}</div>
        <div class="date">{{ currentDate | formatDate }}</div>
        <div class="begin">上班时间：{{ attendanceTime[0] }}</div>
        <div class="end">下班时间：{{ attendanceTime[1] }}</div>
        <div class="button">
            <el-button-group>
                <el-button type="primary" icon="el-icon-arrow-left" @click="signIn" :disabled=isSignIn>
                    签到
                </el-button>
                <el-button type="primary" @click="signOut" :disabled=isSignOut>
                    签退<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
        </div>
        <el-steps :active=active align-center>
            <el-step>
                <div slot="title">
                    <span v-if="isSignIn">已签到</span>
                    <span v-else>未签到</span>
                </div>
                <div slot="description">
                    <span v-if="isSignIn">签到时间：{{ attendance.signInTime }}</span>
                </div>
            </el-step>
            <el-step>
                <div slot="title">
                    <span v-if="isSignOut">已签退</span>
                    <span v-else>未签退</span>
                </div>
                <div slot="description">
                    <span v-if="isSignOut">签退时间：{{ attendance.signOutTime }}</span>
                </div>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
import {getAttendance, getAttendanceTime, signIn, signOut} from "../utils/api";

export default {
    name: "Sign",
    data() {
        return {
            attendance: {},
            attendanceTime: [],
            currentDate: new Date(),
            currentTime: new Date(),
        }
    },
    created() {
        this.getAttendance()
    },
    computed: {
        isSignIn() {
            return this.attendance != null
        },
        isSignOut() {
            if (this.attendance == null) {
                return false
            }
            return this.attendance.hasSignOut
        },
        active() {
            if (this.attendance == null) {
                return 0
            } else {
                if (this.attendance.hasSignOut) {
                    return 2
                } else {
                    return 1
                }
            }
        }
    },
    methods: {
        getAttendance() {
            getAttendance().then(response => {
                if (response && response.status === "success") {
                    this.attendance = response.data
                    this.getAttendanceTime()
                }
            })
        },
        getAttendanceTime() {
            getAttendanceTime().then(response => {
                if (response && response.status === "success") {
                    this.attendanceTime = response.data
                }
            })
        },
        signIn() {
            signIn().then(response => {
                if (response && response.status === "success") {
                    this.$message.success(response.message)
                    this.getAttendance()
                }
            })
        },
        signOut() {
            signOut().then(response => {
                if (response && response.status === "success") {
                    this.$message.success(response.message)
                    this.getAttendance()
                }
            })
        }
    },
    filters: {
        formatTime(value) {
            var hours = value.getHours()
            var minutes = value.getMinutes()
            if (hours < 10) hours = "0" + hours
            if (minutes < 10) minutes = "0" + minutes
            return hours + ":" + minutes
        },
        formatDate(value) {
            var year = value.getFullYear()
            var month = value.getMonth() + 1
            var date = value.getDate()
            if (year < 10) year = "0" + year
            if (month < 10) month = "0" + month
            if (date < 10) date = "0" + date
            return year + "年" + month + "月" + date + "日"
        }
    },
}
</script>

<style scoped>
.sign {
    text-align: center;
}

.time {
    margin-top: 40px;
    font-size: 50px;
}

.date {
    margin: 20px 0;
}

.begin {
    margin-top: 40px;
}

.end {
    margin-top: 20px;
}

.button {
    margin: 80px auto;
}

.el-steps {
    max-width: 40%;
    margin: 20px auto;
}
</style>