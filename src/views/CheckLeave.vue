<template>
    <div class="check-leave">
        <el-table border :data="leaves.list" ref="multipleTable" style="width: 100%">
            <el-table-column label="选择" width="50">
                <template slot-scope="scope">
                    <el-radio v-model="selection" :label="scope.row" :disabled="scope.row.status!==0"/>
                </template>
            </el-table-column>
            <el-table-column prop="user.username" label="申请人" align="center" width="100"/>
            <el-table-column prop="beginDate" label="开始日期" align="center" width="100"/>
            <el-table-column prop="endDate" label="结束日期" align="center" width="100"/>
            <el-table-column prop="reason" label="请假原因"/>
            <el-table-column prop="comment" label="审批意见"/>
            <el-table-column prop="type" label="类型" align="center" width="60"/>
            <el-table-column prop="status" label="状态" align="center" width="80" :formatter="formatter"/>
        </el-table>
        <div class="menu">
            <el-pagination background layout="prev, pager, next" :pager-count="5" :total="leaves.total"
                           :hide-on-single-page="false" @current-change="handleCurrentChange"/>
            <el-button type="success" size="small" @click="agree">通过</el-button>
            <el-button type="danger" size="mini" @click="refuse">拒绝</el-button>
        </div>
    </div>
</template>

<script>
import {checkLeave, getLeaves} from "@/utils/api";

export default {
    name: "CheckLeave",
    data() {
        return {
            leaves: {},
            selection: 0
        }
    },
    created() {
        this.getLeaves()
    },
    methods: {
        getLeaves(pageNumber) {
            getLeaves({pageNumber}).then(response => {
                if (response && response.status === "success") {
                    this.leaves = response.data
                }
            })
        },
        selectable(row) {
            if (row.status === 0) {
                return true
            }
        },
        formatter(row) {
            if (row.status === 1) {
                return "通过"
            } else if (row.status === 2) {
                return "拒绝"
            }
            return "未审核"
        },
        check(status) {
            if (this.selection === 0) {
                this.$message.error("请选择要操作的项目！")
            } else {
                this.$prompt("请输入审核意见", "提示", {
                    inputPattern: /\S/,
                    inputErrorMessage: "审批意见不能为空"
                }).then(({value}) => {
                    const username = this.selection.user.username
                    const id = this.selection.id
                    const user = {username}
                    const comment = value
                    checkLeave({id, user, comment, status}).then(response => {
                        if (response && response.status === "success") {
                            this.$message.success(response.message)
                            this.getLeaves()
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消操作！"
                    })
                })
            }
        },
        agree() {
            this.check(1)
        },
        refuse() {
            this.check(2)
        },
        handleCurrentChange(pageNumber) {
            this.getLeaves(pageNumber)
        }
    }
}
</script>

<style scoped>
.el-pagination {
    margin-right: auto;
}

.menu {
    margin-top: 20px;
    display: flex;
}
</style>