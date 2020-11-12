<template>
    <el-calendar v-model="currentDate">
        <template #dateCell="{date, data}">
            {{ data.day.slice(8) }}
            <div class="clock-description">
                {{ showDescription(date, data) }}
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
            currentMonth: new Date(),
            currentDay: new Date(),
            attendances: []
        }
    },
    watch: {
        currentDate(currentDate) {
            if (currentDate.getMonth() !== this.currentMonth.getMonth()) {
                this.currentMonth = currentDate
                this.getAttendances(currentDate)
            }
        }
    },
    created() {
        this.getAttendances(this.currentMonth)
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
        showDescription(date, data) {
            if (date.getMonth() === this.currentMonth.getMonth() && date < this.currentDay.setHours(0)) {
                for (let i = 0; i < this.attendances.length; i++) {
                    if (this.attendances[i].clockDate === data.day) {
                        if (!this.attendances[i].clockOutTime) {
                            return '未签退'
                        }
                        if (this.attendances[i].clockDescription) {
                            return this.attendances[i].clockDescription
                        }
                        return '正常'
                    }
                }
                return '缺勤'
            }
        }
    }
}
</script>