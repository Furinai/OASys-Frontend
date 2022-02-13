<template>
    <div class="text-center">
        <div class="current-time">{{ currentTime }}</div>
        <div class="current-date">{{ currentDate }}</div>
        <div class="clock-button">
            <el-button-group>
                <el-button :disabled="Boolean(attendance)" size="large" type="primary" @click="clockIn">
                    签到
                </el-button>
                <el-button :disabled="Boolean(!attendance) || Boolean(attendance.clockOutTime)" size="large" type="primary"
                           @click="clockOut">
                    签退
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
import {clockIn, clockOut, getAttendances} from '../utils/api'
import {mapState} from 'vuex'
import {ElMessage} from 'element-plus'
import dayjs from 'dayjs'

export default {
    name: "Attendance-Clock",
    data() {
        return {
            attendance: {},
            currentTime: dayjs().format('HH:mm'),
            currentDate: dayjs().format('YYYY年MM月DD日')
        }
    },
    created() {
        this.getAttendances()
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
        clockIn() {
            clockIn({userId: this.auth.id}).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    let minutes = this.attendance.comeLateMinutes
                    if (minutes) {
                        ElMessage.success('签到成功，迟到' + minutes + '分钟')
                    } else {
                        ElMessage.success('签到成功')
                    }
                }
            })
        },
        clockOut() {
            clockOut({id: this.attendance.id}).then(result => {
                if (result.code === '0000') {
                    this.attendance = result.data
                    let minutes = this.attendance.leaveEarlyMinutes
                    if (minutes) {
                        ElMessage.success('签退成功，早退' + minutes + '分钟')
                    } else {
                        ElMessage.success('签退成功')
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.current-time {
    margin-top: 40px;
    font-size: 50px;
}

.current-date {
    margin: 20px 0;
}

.clock-button {
    margin-top: 100px;
}
</style>