<template>
    <el-calendar v-model="currentDate">
        <template #dateCell="{data}">
            {{ data.day.slice(8) }}
            <div v-if="verifyDateRange(data.date)" class="clock-description">
                <template v-if="hasAttendance(data)">
                    <el-popover placement="top" trigger="hover">
                        <div class="clock-time">
                            签到时间：{{ data.attendance.clockInTime }}
                        </div>
                        <div class="clock-time">
                            签退时间：{{ data.attendance.clockOutTime }}
                        </div>
                        <template #reference>
                            <i class="el-icon-warning" v-if="!data.attendance.clockOutTime
                            ||data.attendance.comeLateMinutes||data.attendance.leaveEarlyMinutes">
                                    <span v-if="!data.attendance.clockOutTime">
                                        未签退
                                    </span>
                                <span v-if="data.attendance.comeLateMinutes">
                                        迟到
                                    </span>
                                <span v-if="data.attendance.leaveEarlyMinutes">
                                        早退
                                    </span>
                            </i>
                            <i class="el-icon-success" v-else>
                                正常
                            </i>
                        </template>
                    </el-popover>
                </template>
                <template v-else>
                    <i class='el-icon-error'>
                        缺勤
                    </i>
                </template>
            </div>
        </template>
    </el-calendar>
</template>

<script>
import {getAttendances} from '/@/utils/api'
import {mapState} from 'vuex'

export default {
    name: "Attendance-Record-View",
    data() {
        return {
            currentDate: new Date(),
            currentMonth: new Date().getMonth(),
            currentDay: new Date().setHours(0),
            attendances: []
        }
    },
    watch: {
        currentDate(currentDate) {
            if (currentDate.getMonth() !== this.currentMonth) {
                this.currentMonth = currentDate.getMonth()
                this.getAttendances(currentDate)
            }
        }
    },
    created() {
        this.getAttendances(this.currentDate)
    },
    computed: mapState([
        "auth"
    ]),
    methods: {
        getAttendances(currentMonth) {
            let year = currentMonth.getFullYear(), month = currentMonth.getMonth() + 1
            getAttendances({userId: this.auth.id, year, month}).then(result => {
                if (result.code === '0000') {
                    this.attendances = result.data
                }
            })
        },
        hasAttendance(data) {
            for (let i = 0; i < this.attendances.length; i++) {
                if (this.attendances[i].clockDate === data.day) {
                    data.attendance = this.attendances[i]
                    return true
                }
            }
            return false
        },
        verifyDateRange(date) {
            return date.getMonth() === this.currentMonth && date < this.currentDay
        }
    }
}
</script>

<style>
.clock-time {
    margin: 10px 10px;
}

.clock-description {
    font-size: 14px;
    margin-top: 20px;
}
</style>