<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form :model="user" :rules="rules" ref="user" label-width="80px">
            <el-form-item prop="username" label="用户名">
                <el-input type="text" v-model="user.username" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item v-if="editMode === 'update'" label="密码">
                <el-input type="password" v-model="user.password" maxlength="20"/>
            </el-form-item>
            <el-form-item v-else prop="password" label="密码">
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
            <el-form-item prop="dept" label="部门">
                <el-select v-model="user.dept" value-key="id">
                    <el-option v-for="dept in depts" :label="dept.name" :value="dept"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="roles" label="角色">
                <el-select v-model="user.roles" value-key="id" multiple>
                    <el-option v-for="role in roles" :label="role.name" :value="role"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="profilePicture" ref="pictureUploader" label="头像">
                <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadProfilePicture">
                    <img v-if="uploaded || user.profilePicture" :src="user.profilePicture" class="avatar" alt="头像">
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
                <el-button @click="onSubmit('user')" type="primary" :loading="loading">确认
                </el-button>
                <el-button @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="users" style="width: 100%" border>
            <el-table-column type="expand">
                <template #default="props">
                    <el-form label-position="left" class="table-expand" inline>
                        <el-form-item label="邮箱地址">
                            <span>{{ props.row.emailAddress }}</span>
                        </el-form-item>
                        <el-form-item label="电话号码">
                            <span>{{ props.row.phoneNumber }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ props.row.createTime }}</span>
                        </el-form-item>
                        <el-form-item label="修改时间">
                            <span>{{ props.row.updateTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" align="center" width="150"/>
            <el-table-column label="头像" align="center" width="100">
                <template #default="scope">
                    <el-avatar :src="scope.row.profilePicture"/>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" align="center" width="150"/>
            <el-table-column prop="fullName" label="姓名" align="center" width="150"/>
            <el-table-column prop="gender" label="性别" align="center" width="100"/>
            <el-table-column prop="dept.name" label="部门" align="center" width="150"/>
            <el-table-column prop="roles" label="角色" align="center">
                <template #default="scope">
                    <el-tag v-for="role in scope.row.roles" effect="plain">{{ role.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px">
                <template #header #default="scope">
                    <el-button type="primary" @click="createUser">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updateUser">编辑</el-dropdown-item>
                                <el-dropdown-item command="deleteUser">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :pager-count="5" :total="size"
                           :hide-on-single-page="true" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {createUser, deleteUser, getDepts, getRoles, getUsers, updateUser, uploadProfilePicture} from '../utils/api'

export default {
    name: "User-Manage",
    data() {
        return {
            user: {roles: []},
            users: [],
            depts: [],
            roles: [],
            size: 0,
            editMode: '',
            uploaded: false,
            loading: false,
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
                dept: [
                    {required: true, message: '请选择部门', trigger: 'change'}
                ],
                roles: [
                    {type: 'array', required: true, message: '请选择角色', trigger: 'change'}
                ],
                profilePicture: [
                    {required: true, message: '请上传头像', trigger: 'change'}
                ],
                emailAddress: [
                    {type: 'email', required: true, message: '请输入正确的邮箱地址', trigger: 'blur'}
                ],
                phoneNumber: [
                    {required: true, message: '请输入正确手机号码', trigger: 'blur'},
                    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getUsers()
    },
    methods: {
        getUsers(pageNumber) {
            getUsers({pageNumber}).then(result => {
                if (result.code === '0000') {
                    this.users = result.data.list
                    this.size = result.data.size
                    this.$refs.table.doLayout()
                }
            })
        },
        getDepts() {
            getDepts().then(result => {
                if (result.code === '0000') {
                    this.depts = result.data
                }
            })
        },
        getRoles() {
            getRoles().then(result => {
                if (result.code === '0000') {
                    this.roles = result.data
                }
            })
        },
        onSubmit(user) {
            this.$refs[user].validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.editMode === 'create') {
                        createUser(this.user).then(result => {
                            if (result.code === '0000') {
                                this.uploaded = false
                                this.$refs[user].resetFields()
                                this.$message.success("新增成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateUser(this.user).then(result => {
                            if (result.code === '0000') {
                                this.$message.success("更新成功！")
                                this.editMode = ''
                            }
                        }).finally(() => this.loading = false)
                    }
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
        },
        createUser() {
            this.user = {roles: []}
            if (this.depts.length === 0) {
                this.getDepts()
            }
            if (this.roles.length === 0) {
                this.getRoles()
            }
            this.editMode = 'create'
        },
        updateUser(row) {
            this.user = row
            if (this.depts.length === 0) {
                this.getDepts()
            }
            if (this.roles.length === 0) {
                this.getRoles()
            }
            this.editMode = 'update'
        },
        deleteUser(row) {
            this.$confirm("确定删除？").then(() => {
                deleteUser(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.users.indexOf(row)
                        this.users.splice(index, 1)
                        this.$message.success("删除成功！")
                    }
                })
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case "updateUser":
                    this.updateUser(row)
                    break
                case "deleteUser":
                    this.deleteUser(row)
                    break
            }
        },
        handlePageChange(pageNum) {
            this.getUsers(pageNum)
        }
    }
}
</script>

<style>
.table-expand {
    font-size: 0;
}

.table-expand label {
    width: 90px;
    color: #99a9bf;
}

.avatar {
    width: 215px;
    height: 215px;
    display: block;
}
</style>