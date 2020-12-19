<template>
    <div class="publish-announcement">
        <el-form :model="announcement" :rules="rules" ref="announcement">
            <el-form-item prop="title">
                <el-input type="text" v-model="announcement.title" placeholder="标题" maxlength="100" show-word-limit/>
            </el-form-item>
            <el-form-item prop="content">
                <el-input type="textarea" v-model="announcement.content" :autosize="{minRows: 6}"
                          placeholder="摘要" minlength="10" maxlength="2000" show-word-limit/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button size="small" @click="onCreateSubmit('announcement')" type="primary" :loading="loading">确认
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {createAnnouncement} from "/src/utils/api";

export default {
    name: "PublishAnnouncement",
    data() {
        return {
            announcement: {},
            loading: false,
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        onCreateSubmit(announcement) {
            this.$refs[announcement].validate((valid) => {
                if (valid) {
                    this.loading = true
                    createAnnouncement(this.announcement).then(result => {
                        if (result.code === '0000') {
                            this.$refs[announcement].resetFields()
                            this.$message.success("发布成功！")
                        }
                    }).finally(() => this.loading = false)
                }
            })
        }
    }
}
</script>