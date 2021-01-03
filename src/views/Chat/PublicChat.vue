<template>
    <el-scrollbar class="frame" ref="elscrollbar">
        <ul>
            <li v-for="message in messages">
                <div class="message" :class="{'mine': message.username === auth.username}">
                    <div class="user">
                        <el-avatar :src="message.profilePicture"/>
                        <div class="name">{{ message.username }}</div>
                    </div>
                    <div class="content"> {{ message.content }}</div>
                </div>
            </li>
        </ul>
    </el-scrollbar>
    <div class="flex-between">
        <el-input v-model.trim="content"></el-input>
        <el-button class="send-button" type="primary" :disabled="content===''" @click="sendMessage">
            发送
        </el-button>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getToken} from '/src/utils/auth';

export default {
    name: 'PublicChat',
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
            this.webSocket = new WebSocket('ws://localhost:8450/chat?token=' + token)
            this.webSocket.onmessage = this.onMessage
        },
        onMessage(event) {
            this.messages.push(JSON.parse(event.data))
        },
        sendMessage() {
            this.webSocket.send(this.content)
            this.content = null
        }
    }
}
</script>

<style scoped>
.frame {
    height: 80vh;
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

.send-button {
    margin-left: 15px;
}
</style>