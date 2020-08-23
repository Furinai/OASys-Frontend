<template>
    <div class="sign-setting">
        <h2>工作时间设置</h2>
        <div class="begin">上班时间：{{ attendanceTime[0] }}</div>
        <div class="end">下班时间：{{ attendanceTime[1] }}</div>
        <el-time-picker is-range arrow-control v-model="attendanceTime" value-format="HH:mm"/>
        <div class="submit">
            <el-button type="primary" @click="onSubmit">
                确认修改
            </el-button>
        </div>
    </div>
</template>

<script>
import {getAttendanceTime, setAttendanceTime} from "../utils/api";

export default {
    name: "SignSetting",
    data() {
        return {
            attendanceTime: [],
        }
    },
    created() {
        this.getAttendanceTime()
    },
    methods: {
        getAttendanceTime() {
            getAttendanceTime().then(response => {
                if (response && response.status === "success") {
                    this.attendanceTime = response.data
                }
            })
        },
        onSubmit() {
            var begin = this.attendanceTime[0]
            var end = this.attendanceTime[1]
            setAttendanceTime({begin, end}).then(response => {
                if (response && response.status === "success") {
                    this.$message.success(response.message)
                }
            })
        }
    }
}
</script>

<style scoped>
h2 {
    margin: 80px 0 40px;
}

.begin {
    margin-top: 40px;
}

.end {
    margin: 20px 0 40px;
}

.submit {
    margin: 40px;
}

.sign-setting {
    text-align: center;
}
</style>