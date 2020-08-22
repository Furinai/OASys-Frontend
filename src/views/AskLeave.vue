<template>
    <div class="ask-leave">
        <el-form>
            <el-form-item>
                <el-date-picker v-model="duration" type="daterange" value-format="yyyy-MM-dd"
                                start-placeholder="开始日期" end-placeholder="结束日期"/>
            </el-form-item>
            <el-form-item>
                <el-select v-model="type" placeholder="请选择类别">
                    <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input type="textarea" :rows="10" placeholder="请输入请假理由" v-model="reason"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {askLeave} from "../utils/api";

export default {
    name: "AskLeave",
    data() {
        return {
            duration: [],
            reason: "",
            type: "",
            options: [
                {value: "事假"},
                {value: "病假"},
                {value: "婚假"},
                {value: "产假"},
            ]
        }
    },
    methods: {
        onSubmit() {
            if (this.reason == null || this.reason.trim() === "") {
                this.$message.error("请填写请假理由！")
            } else if (this.duration.length < 2) {
                this.$message.error("请选择请假日期！")
            } else if (this.type === "") {
                this.$message.error("请选择请假类别！")
            } else {
                var reason = this.reason
                var type = this.type
                var beginDate = this.duration[0]
                var endDate = this.duration[1]
                askLeave({reason, type, beginDate, endDate}).then(response => {
                    if (response && response.status === "success") {
                        this.$message.success(response.message)
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.ask-leave {
    text-align: center;
    margin-top: 80px;
}

.el-textarea {
    width: 348px;
}

.el-select {
    width: 348px;
}

.el-select-dropdown__list {
    margin-bottom: 12px;
}
</style>