<template>
    <div class="manage-user">
        <div v-if="editMode">
            <el-form :model="user" label-width="80px">
                <el-form-item label="用户名">
                    <el-input type="text" v-model="user.username" maxlength="20" show-word-limit/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="user.password" maxlength="20"/>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input type="text" v-model="user.fullName" maxlength="10" show-word-limit/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="user.gender">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="user.dept.id" placeholder="请选择部门">
                        <el-option v-for="dept in depts" :label="dept.name" :value="dept.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadProfilePicture">
                        <img :src="user.profilePicture" class="avatar" alt="头像">
                    </el-upload>
                </el-form-item>
                <el-form-item label="邮箱地址">
                    <el-input type="text" v-model="user.emailAddress" maxlength="20" show-word-limit/>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input type="text" v-model="user.phoneNumber" maxlength="20" show-word-limit/>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button size="small" @click="onUpdateSubmit()" type="primary" :loading="loading">确认
                    </el-button>
                    <el-button size="small" @click="editMode = false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <el-table :data="users" style="width: 100%" border>
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
                <el-table-column prop="id" label="ID" align="center" width="100"/>
                <el-table-column label="头像" align="center" width="100">
                    <template #default="scope">
                        <el-avatar :src="scope.row.profilePicture" size="small"/>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center"/>
                <el-table-column prop="fullName" label="姓名" align="center"/>
                <el-table-column prop="gender" label="性别" align="center" width="150"/>
                <el-table-column prop="dept.name" label="部门" align="center" width="150"/>
                <el-table-column label="操作" align="center" width="150px">
                    <template #default="scope">
                        <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="editUser">编辑</el-dropdown-item>
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
    </div>
</template>

<script>
import {deleteUser, getDepts, getUsers, updateUser, uploadProfilePicture} from "/src/utils/api";

export default {
    name: "ManageUser",
    data() {
        return {
            user: {},
            users: [],
            depts: [{
                id: 0,
                name: ''
            }],
            size: 0,
            editMode: false,
            loading: false
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
                }
            })
        },
        getDepts() {
            getDepts().then(result => {
                if (result.code === '0000') {
                    this.depts = result.data.list
                }
            })
        },
        onUpdateSubmit() {
            this.loading = true
            updateUser(this.user).then(result => {
                if (result.code === '0000') {
                    this.$message.success("更新成功！")
                    this.editMode = false
                }
            }).finally(() => this.loading = false)
        },
        uploadProfilePicture(params) {
            let formData = new FormData()
            formData.append('multipartFile', params.file)
            uploadProfilePicture(formData).then(result => {
                if (result.code === '0000') {
                    this.$message.success('上传成功！')
                    this.user.profilePicture = result.data
                }
            })
        },
        editUser(row) {
            this.user = row
            this.getDepts()
            this.editMode = true
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
                case "editUser":
                    this.editUser(row)
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