<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form :model="role" :rules="rules" ref="role">
            <el-form-item prop="name">
                <el-input type="text" v-model="role.name" placeholder="角色名" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button size="small" @click="onSubmit('role')" type="primary" :loading="loading">
                    确认
                </el-button>
                <el-button size="small" @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="roles" style="width: 100%" size="medium" border>
            <el-table-column prop="name" label="角色名" align="center" width="300"/>
            <el-table-column prop="createTime" label="创建时间" align="center"/>
            <el-table-column prop="updateTime" label="修改时间" align="center"/>
            <el-table-column label="操作" align="center" width="200">
                <template #header #default="scope">
                    <el-button type="primary" size="mini" @click="createRole">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updateRole">编辑</el-dropdown-item>
                                <el-dropdown-item command="deleteRole">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {createRole, deleteRole, getRoles, updateRole} from "/src/utils/api";

export default {
    name: "ManageRole",
    data() {
        return {
            role: {},
            roles: [],
            editMode: '',
            loading: false,
            rules: {
                name: [
                    {required: true, message: '请输入角色名', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getRoles()
    },
    methods: {
        getRoles(pageNumber) {
            getRoles({pageNumber}).then(result => {
                if (result.code === '0000') {
                    this.roles = result.data
                    this.$refs.table.doLayout()
                }
            })
        },
        onSubmit(role) {
            this.$refs[role].validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.editMode === 'create') {
                        createRole(this.role).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                this.getRoles()
                                this.$message.success("新增成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateRole(this.role).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                this.$message.success("更新成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                }
            })
        },
        createRole() {
            this.editMode = 'create'
            this.role = {}
        },
        updateRole(row) {
            this.editMode = 'update'
            this.role = row
        },
        deleteRole(row) {
            this.$confirm("确定删除？").then(() => {
                deleteRole(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.roles.indexOf(row)
                        this.roles.splice(index, 1)
                        this.$message.success("删除成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning("已取消！")
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case "updateRole":
                    this.updateRole(row)
                    break
                case "deleteRole":
                    this.deleteRole(row)
                    break
            }
        }
    }
}
</script>