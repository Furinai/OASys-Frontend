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
                    <el-input type="text" v-model="user.name" maxlength="10" show-word-limit/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="user.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="user.dept.id" placeholder="请选择部门">
                        <el-option v-for="dept in depts" :label="dept.name" :value="dept.id" :key="dept.id"></el-option>
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
                    <el-button size="small" @click="onUpdateSubmit(user)" type="primary" :loading="loading">确认
                    </el-button>
                    <el-button @click="editMode = false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <el-table :data="users" style="width: 100%" border>
                <el-table-column type="expand">
                    <template slot-scope="props">
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
                    <template slot-scope="scope">
                        <el-avatar :src="scope.row.profilePicture" size="small"/>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center"/>
                <el-table-column prop="name" label="姓名" align="center"/>
                <el-table-column prop="sex" label="性别" align="center" width="150"/>
                <el-table-column prop="dept.name" label="部门" align="center" width="150"/>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="editUser">编辑</el-dropdown-item>
                                <el-dropdown-item command="deleteUser">删除</el-dropdown-item>
                            </el-dropdown-menu>
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
import {deleteUser, getDepts, getUsers, updateUser, uploadProfilePicture} from "@/utils/api";

export default {
    name: "ManageUser",
    data() {
        return {
            user: {},
            users: [],
            depts: [],
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
            getUsers({pageNumber}).then(response => {
                if (response && response.status === 200) {
                    this.users = response.data
                    this.size = response.size
                }
            })
        },
        getDepts() {
            getDepts().then(response => {
                if (response && response.status === 200) {
                    this.depts = response.data
                }
            })
        },
        onUpdateSubmit(user) {
            this.loading = true
            updateUser(user).then(response => {
                if (response && response.status === 200) {
                    this.$message.success("更新成功！")
                }
            }).finally(() => this.loading = false)
        },
        uploadProfilePicture(params) {
            let formData = new FormData()
            formData.append('multipartFile', params.file)
            uploadProfilePicture(formData).then(response => {
                if (response && response.status === 201) {
                    this.$message.success('上传成功！')
                    this.user.profilePicture = response.data
                }
            })
        },
        editUser(row) {
            this.editMode = true
            this.user = row
            if (this.depts.length === 0) {
                this.getDepts()
            }
        },
        deleteUser(row) {
            this.$confirm("确定删除？").then(() => {
                deleteUser(row.id).then(response => {
                    if (response.status === 200) {
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