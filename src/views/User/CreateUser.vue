<template>
    <el-form :model="user" :rules="rules" ref="user" label-width="80px">
        <el-form-item prop="username" label="用户名">
            <el-input type="text" v-model="user.username" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="user.password" maxlength="20"/>
        </el-form-item>
        <el-form-item prop="fullName" label="姓名">
            <el-input type="text" v-model="user.fullName" maxlength="10" show-word-limit/>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="user.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="dept.id" label="部门">
            <el-select v-model="user.dept.id" placeholder="请选择部门">
                <el-option v-for="dept in depts" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="profilePicture" ref="pictureUploader" label="头像">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadProfilePicture">
                <img v-if="uploaded" :src="user.profilePicture" class="avatar" alt="头像">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item prop="emailAddress" label="邮箱地址">
            <el-input type="text" v-model="user.emailAddress" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item prop="phoneNumber" label="电话号码">
            <el-input type="text" v-model="user.phoneNumber" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item class="text-right">
            <el-button size="small" @click="onCreateSubmit('user')" type="primary" :loading="loading">确认
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {createUser, getDepts, uploadProfilePicture} from "/src/utils/api";

export default {
    name: "CreateUser",
    data() {
        return {
            user: {dept: {}},
            depts: [],
            loading: false,
            uploaded: false,
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                ],
                fullName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                ],
                gender: [{required: true, message: '请选择性别', trigger: 'change'}
                ],
                'dept.id': [
                    {required: true, message: '请选择部门', trigger: 'change'}
                ],
                profilePicture: [
                    {required: true, message: '请上传头像', trigger: 'change'}
                ],
                emailAddress: [
                    {required: true, message: '请输入正确的邮箱地址', trigger: 'blur', type: 'email'}
                ],
                phoneNumber: [
                    {required: true, message: '请输入正确手机号码', trigger: 'blur'},
                    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getDepts()
    },
    methods: {
        getDepts() {
            getDepts().then(result => {
                if (result.code === '0000') {
                    this.depts = result.data
                }
            })
        },
        onCreateSubmit(user) {
            this.$refs[user].validate((valid) => {
                if (valid) {
                    this.loading = true
                    createUser(this.user).then(result => {
                        if (result.code === '0000') {
                            this.uploaded = false
                            this.$refs[user].resetFields()
                            this.$message.success("添加成功！")
                        }
                    }).finally(() => this.loading = false)
                }
            })
        },
        uploadProfilePicture(params) {
            let formData = new FormData()
            formData.append('multipartFile', params.file)
            uploadProfilePicture(formData).then(result => {
                if (result.code === '0000') {
                    this.$message.success('上传成功！')
                    this.user.profilePicture = result.data
                    this.$refs.pictureUploader.clearValidate()
                    this.uploaded = true
                }
            })
        }
    }
}
</script>