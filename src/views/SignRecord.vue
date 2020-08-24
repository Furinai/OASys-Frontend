<template>
    <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
            <p>
                {{ data.day.split("-").slice(1).join("-") }}
                <span v-for="date in attendances" :key="date">
                {{ data.day == date ? "✔️" : "" }}
                </span>
            </p>
        </template>
    </el-calendar>
</template>

<script>
import {getAttendances} from "../utils/api";

export default {
    name: "SignRecord",
    data() {
        return {
            attendances: {}
        }
    },
    created() {
        this.getAttendances()
    },
    methods: {
        getAttendances() {
            getAttendances().then(response => {
                if (response && response.status === "success") {
                    this.attendances = response.data
                }
            })
        }
    }
}
</script>