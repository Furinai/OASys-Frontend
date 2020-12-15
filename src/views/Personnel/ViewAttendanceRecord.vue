<template>
    <el-calendar v-model="currentDate">
        <template #dateCell="{date, data}">
            {{ data.day.slice(8) }}
            <div v-if="verifyDateRange(date)" class="clock-description">
                <div v-if="hasAttendance(data)">
                    <el-popover placement="top" trigger="hover">
                        <div class="clock-time">
                            签到时间：{{ data.attendance.clockInTime }}
                        </div>
                        <div class="clock-time">
                            签退时间：{{ data.attendance.clockOutTime }}
                        </div>
                        <div slot="reference">
                            <span class="warning" v-if="!data.attendance.clockOutTime">
                            <i class="el-icon-warning">
                                未签退
                            </i>
                        </span>
                            <span class="warning" v-else-if="data.attendance.clockDescription">
                            <i class="el-icon-warning">
                                {{ data.attendance.clockDescription }}
                            </i>
                        </span>
                            <span class="success" v-else>
                            <i class="el-icon-success">
                                正常
                            </i>
                        </span>
                        </div>

                    </el-popover>
                </div>
                <div v-else class="danger">
                    <i class='el-icon-error'>
                        缺勤
                    </i>
                </div>
            </div>
        </template>
    </el-calendar>
</template>

<script>
import {getAttendances} from "@/utils/api";
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
            getAttendances({userId: this.auth.id, year, month}).then(response => {
                if (response && response.status === 200) {
                    this.attendances = response.data
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