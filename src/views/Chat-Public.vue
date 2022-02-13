<template>
    <el-scrollbar ref="elscrollbar" class="frame">
        <ul class="message-list">
            <li v-for="message in messages">
                <div v-if="message.type === 'SYSTEM'" class="system-message">
                    {{ message.content }}
                </div>
                <div v-else :class="{'mine': message.username === auth.username}" class="public-message">
                    <div class="user">
                        <el-avatar :src="message.profilePicture"/>
                        <div class="name">{{ message.fullName }}</div>
                    </div>
                    <div class="content"> {{ message.content }}</div>
                </div>
            </li>
        </ul>
    </el-scrollbar>
    <div class="flex-between input-box">
        <el-input v-model.trim="content" @keyup.enter="sendMessage"></el-input>
        <el-button :disabled="content===''" class="send-button" type="primary" @click="sendMessage">
            发送
        </el-button>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getToken} from '../utils/auth'
import {ElMessage} from 'element-plus'

export default {
    name: 'Chat-Public',
    data() {
        return {
            content: '',
            messages: [],
            webSocket: null
        }
    },
    created() {
        if ('WebSocket' in window) {
            this.initWebSocket()
        }
    },
    watch: {
        messages() {
            const wrap = this.$refs['elscrollbar'].$refs['wrap']
            this.$nextTick(() => {
                wrap.scrollTop = wrap.scrollHeight
            })
        }
    },
    computed: mapState(
        ['auth']
    ),
    methods: {
        initWebSocket() {
            const token = getToken().substr(7)
            this.webSocket = new WebSocket('ws://localhost:8080/api/chat?token=' + token)
            this.webSocket.onmessage = this.onMessage
            this.webSocket.onerror = this.onError
        },
        onMessage(event) {
            this.messages.push(JSON.parse(event.data))
        },
        onError() {
            ElMessage.error("WebSocket连接失败")
        },
        sendMessage() {
            this.webSocket.send(this.content)
            this.content = ''
        }
    },
    unmounted() {
        this.webSocket.close()
    }
}
</script>

<style scoped>
.frame {
    height: 80vh;
    margin: auto 10px;
}

.message-list {
    text-align: center;
    margin: auto 20px 20px;
}

.system-message {
    color: #888;
    width: auto;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: inline-block;
    background-color: #f4f4f5;
}

.public-message {
    position: relative;
    margin-bottom: 10px;
    padding-left: 60px;
    text-align: left;
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

.content {
    color: #333;
    position: relative;
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    display: inline-block;
    background-color: #e2e2e2;
    word-break: break-all;
}

.content::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 14px;
    border-width: 10px;
    border-style: solid dashed dashed;
    border-color: #e2e2e2 transparent transparent;
}

.mine {
    text-align: right;
    padding-left: 0;
    padding-right: 60px;

}

.mine .user {
    right: 10px;
}

.mine .name {
    left: auto;
    right: 55px;
}

.mine .content {
    color: #fff;
    background-color: #5FB878;
}

.mine .content::after {
    left: auto;
    right: -10px;
    border-top-color: #5FB878;
}

.input-box {
    margin-left: 30px;
    margin-right: 40px;
}

.send-button {
    margin-left: 15px;
}
</style>