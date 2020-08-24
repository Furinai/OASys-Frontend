<template>
    <div class="notice">
        <el-popover placement="bottom-start" width="600">
            <el-table height="380" border :data="notices"
                      style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="40"/>
                <el-table-column prop="createdTime" label="时间" width="160"/>
                <el-table-column prop="content" label="内容"/>
            </el-table>
            <el-button type="text" slot="reference">
                通知
                <el-badge :value=unreadCount :max="99"/>
            </el-button>
            <div class="mark">
                <el-button size="small" @click="markRead">标记已读</el-button>
            </div>
        </el-popover>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {getNotices, markRead} from "../utils/api";

export default {
    name: "Notice",
    data() {
        return {
            notices: []
        }
    },
    created() {
        this.getNotices()
    },
    watch: {
        $route() {
            this.getNotices()
        }
    },
    computed: {
        ...mapState(["auth"]),
        unreadCount() {
            return this.notices.length
        }
    },
    methods: {
        getNotices() {
            getNotices().then(response => {
                if (response && response.status === "success") {
                    this.notices = response.data.reverse()
                }
            })
        },
        markRead() {
            if (this.$refs.multipleTable.selection < 1) {
                this.$message.error("至少选择一个！")
                return
            }
            var ids = []
            this.$refs.multipleTable.selection.forEach(item => {
                ids.push(item.id)
            })
            markRead(ids).then(response => {
                if (response && response.status === "success") {
                    this.$message.success(response.message)
                    this.getNotices()
                }
            })

        }
    }
}
</script>

<style scoped>
.mark {
    text-align: right;
    margin-top: 10px;
}
</style>