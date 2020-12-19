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
                            <span class="warning" v-if="!data.attendance.clockOutTime||data.attendance.clockDescription">
                                <i class="el-icon-warning">
                                    {{ data.attendance.clockDescription }}
                                    <span v-if="!data.attendance.clockOutTime">
                                        未签退
                                    </span>
                                </i>
                            </span>
                            <span class="success" v-else>
                                <i class="el-icon-success">
                                    正常
                                </i>
                            </span>
                        </template>
                    </el-popover>
                </template>
                <template v-else>
                    <span class="danger">
                        <i class='el-icon-error'>
                            缺勤
                        </i>
                    </span>
                </template>
            </div>
        </template>
    </el-calendar>
</template>

<script>
import {getAttendances} from "/src/utils/api";
import {mapState} from "vuex";

export default {
    name: "ViewAttendanceRecord",
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
                this.currentMonth = currentDate.getMonth();
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