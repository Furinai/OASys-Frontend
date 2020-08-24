<template>
    <div class="edit-user">
        <el-table border :data="users.list" ref="multipleTable" style="width: 100%">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column prop="id" label="ID" align="center" width="100"/>
            <el-table-column prop="avatar" label="头像" align="center" width="100">
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.avatar" size="small"/>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" align="center" width="150"/>
            <el-table-column prop="role.name" label="角色" align="center" width="100"/>
            <el-table-column prop="email" label="邮箱" align="center" width="200"/>
            <el-table-column prop="synopsis" label="简介"/>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-button size="mini"
                               @click="handleEdit(scope.row)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="menu">
            <el-pagination background layout="prev, pager, next" :pager-count="5" :total="users.total"
                           :hide-on-single-page="false" @current-change="handleCurrentChange" :page-size="8"/>
            <el-button type="danger" size="small" @click="deleteUser">删除</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <el-form label-width="80px" v-model="user">
                <el-input type="hidden" v-model="user.id"/>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="user.password"
                              placeholder="不需要修改密码则留空"/>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="user.role.id">
                        <el-option :key="item.key" :label="item.name"
                                   :value="item.id" v-for="item in roles"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">
                    取消
                </el-button>
                <el-button @click="updateUser" type="primary">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getUsers, getRoles, updateUser, deleteUser} from "../utils/api";

export default {
    name: "EditUser",
    data() {
        return {
            users: {},
            roles: [],
            user: {role: {}},
            dialogVisible: false,
        }
    },
    created() {
        this.getUsers()
        this.getRoles()
    },
    methods: {
        getUsers(pageNumber) {
            getUsers({pageNumber}).then(response => {
                if (response && response.status === "success") {
                    this.users = response.data
                }
            })
        },
        getRoles() {
            getRoles({}).then(response => {
                if (response && response.status === "success") {
                    this.roles = response.data
                }
            })
        },
        handleEdit(row) {
            this.user = row
            this.user.password = null
            this.dialogVisible = true
        },
        updateUser() {
            updateUser(this.user).then(response => {
                if (response && response.status === "success") {
                    this.$message.success(response.message)
                    this.dialogVisible = false
                    this.getUsers()
                }
            })
        },
        deleteUser() {
            this.$confirm("永久删除这些用户, 是否继续?").then(() => {
                if (this.$refs.multipleTable.selection < 1) {
                    this.$message.error("至少选择一个用户！")
                } else {
                    var ids = []
                    this.$refs.multipleTable.selection.forEach(item => {
                        ids.push(item.id)
                    })
                    deleteUser(ids).then(response => {
                        if (response && response.status === "success") {
                            this.$message.success(response.message)
                            this.getUsers()
                        }
                    })
                }
            }).catch(() => {
                this.$message.info("已取消删除")
            })
        },
        handleCurrentChange(pageNumber) {
            this.getUsers(pageNumber)
        }
    }
}
</script>

<style scoped>
.el-pagination {
    margin-right: auto;
}

.menu {
    margin-top: 20px;
    display: flex;
}
</style>