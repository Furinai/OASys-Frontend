<template>
    <div class="notice">
        <el-popover placement="bottom-start" width="600">
            <el-table height="380" border :data="notices"
                      style="width: 100%" ref="multipleTable">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="内容">
                </el-table-column>
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
                notices: [],
                webSocket: null,
            }
        },
        created() {
            this.getNotices()
        },
        mounted() {
            if (this.auth && "WebSocket" in window) {
                this.initWebSocket()
            }
        },
        computed: {
            ...mapState(["auth"]),
            unreadCount() {
                return this.notices.length
            }
        },
        watch: {
            auth(value) {
                if ("WebSocket" in window) {
                    if (value) {
                        this.initWebSocket()
                    }
                }
            }
        },
        methods: {
            getNotices() {
                getNotices().then(response => {
                    if (response && response.status === "success") {
                        this.notices = response.object.reverse()
                    }
                })
            },
            markRead() {
                if (this.$refs.multipleTable.selection < 1) {
                    this.$message.error("至少选择一个！")
                } else {
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
            },
            initWebSocket() {
                this.webSocket = new WebSocket("ws://localhost/notice")
                this.webSocket.onmessage = this.webSocketMessage
            },
            webSocketMessage(event) {
                this.notices.unshift(JSON.parse(event.data))
            },
        }
    }
</script>

<style scoped>
    .mark {
        text-align: right;
        margin-top: 10px;
    }
</style>