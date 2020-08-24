<template>
    <div class="chat">
        <el-dialog title="聊天室" :visible.sync="chatDialog" :close-on-click-modal=false center>
            <el-scrollbar style="height: 300px" ref="elscrollbar">
                <ul>
                    <li v-for="item in messages" :key="item.id">
                        <div v-if="item.username != auth.username" class="message">
                            <div class="user">
                                <el-avatar class="avatar" :src="item.avatar"/>
                                <div class="name">{{ item.username }}</div>
                            </div>
                            <div class="text"> {{ item.content }}</div>
                        </div>
                        <div v-else class="message mine">
                            <div class="user">
                                <el-avatar class="avatar" :src="item.avatar"/>
                                <div class="name">{{ item.username }}</div>
                            </div>
                            <div class="text"> {{ item.content }}</div>
                        </div>
                    </li>
                </ul>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-input type="textarea" v-model="content"/>
                <div class="send-button">
                    <el-button size="small" type="primary" @click="sendMessage">发送</el-button>
                </div>
            </span>
        </el-dialog>
        <el-badge class="open-button" :value=unreadCount :max="99">
            <el-button size="small" @click="openDialog">聊天</el-button>
        </el-badge>
    </div>
</template>

<script>
import {mapState} from "vuex"

export default {
    name: "Chat",
    data() {
        return {
            content: "",
            messages: [],
            unreadCount: 0,
            webSocket: null,
            chatDialog: false,
        }
    },
    mounted() {
        if (this.auth && "WebSocket" in window) {
            this.initWebSocket()
        }
    },
    watch: {
        messages() {
            if (this.chatDialog == true) {
                const div = this.$refs["elscrollbar"].$refs["wrap"]
                this.$nextTick(() => {
                    div.scrollTop = div.scrollHeight
                })
            }
        }
    },
    computed: mapState(
        ["auth"]
    ),
    methods: {
        initWebSocket() {
            this.webSocket = new WebSocket("ws://localhost/chat")
            this.webSocket.onmessage = this.webSocketMessage
        },
        webSocketMessage(event) {
            this.messages.push(JSON.parse(event.data))
            if (this.chatDialog == false) {
                this.unreadCount++
            }
        },
        sendMessage() {
            if (this.content !== null && this.content.trim() !== "") {
                this.webSocket.send(this.content)
                this.content = null
            }
        },
        openDialog() {
            if (this.webSocket == null && "WebSocket" in window) {
                this.initWebSocket()
            }
            this.chatDialog = true
            this.unreadCount = 0
        }
    }
}
</script>

<style scoped>
.open-button {
    position: fixed;
    bottom: 25px;
    right: 40px;
}

.send-button {
    margin-top: 15px;
    text-align: right;
}

.message {
    position: relative;
    margin-bottom: 10px;
    padding-left: 60px;
}

.user {
    position: absolute;
    left: 0;
}

.name {
    position: absolute;
    left: 60px;
    top: 0;
    color: #888;
    font-size: 12px;
    white-space: nowrap;
}

.text {
    color: #333;
    position: relative;
    line-height: 25px;
    margin-top: 20px;
    padding: 8px 15px;
    border-radius: 3px;
    display: inline-block;
    background-color: #e2e2e2;
    word-break: break-all;
}

.mine {
    text-align: right;
    padding-left: 0;
    padding-right: 70px;

}

.mine .user {
    right: 10px;
}

.mine .name {
    left: auto;
    right: 70px;
    text-align: right;
}

.mine .text {
    color: #fff;
    text-align: left;
    background-color: #5FB878;
}

.text::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 12px;
    overflow: hidden;
    border-width: 10px;
    border-style: solid dashed dashed;
    border-color: #e2e2e2 transparent transparent;
}

.mine .text::after {
    left: auto;
    right: -10px;
    border-top-color: #5FB878;
}

.el-alert {
    width: 40%;
}
</style>