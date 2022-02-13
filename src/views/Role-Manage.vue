<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form ref="role" :model="role" :rules="rules" label-width="80px">
            <el-form-item label="角色名" prop="name">
                <el-input v-model="role.name" maxlength="20" placeholder="角色名" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item label="权限">
                <el-tree ref="tree" :data="permissions" :props="{label: 'name'}" check-strictly node-key="id"
                         show-checkbox/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button :loading="loading" type="primary" @click="onSubmit('role')">
                    确认
                </el-button>
                <el-button @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="roles" border style="width: 100%">
            <el-table-column align="center" label="角色名" prop="name" width="300"/>
            <el-table-column align="center" label="创建时间" prop="createTime"/>
            <el-table-column align="center" label="修改时间" prop="updateTime"/>
            <el-table-column align="center" label="操作" width="200">
                <template #header #default="scope">
                    <el-button type="primary" @click="createRole">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown trigger="click" @command="handleCommand($event,scope.row)">
                        <el-icon :size="20">
                            <operation/>
                        </el-icon>
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
import {
    createPermissionsToRole,
    createRole,
    deleteRole,
    getPermissions,
    getPermissionsOfRole,
    getRoles,
    updatePermissionsOfRole,
    updateRole
} from '../utils/api'
import {ElMessage, ElMessageBox} from 'element-plus'

export default {
    name: "Role-Manage",
    data() {
        return {
            role: {},
            roles: [],
            permissions: [],
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
        this.getPermissions()
    },
    methods: {
        getRoles() {
            getRoles().then(result => {
                if (result.code === '0000') {
                    this.roles = result.data
                    this.$refs.table.doLayout()
                }
            })
        },
        getPermissions() {
            getPermissions({treeMode: true}).then(result => {
                if (result.code === '0000') {
                    this.permissions = result.data
                }
            })
        },
        getPermissionsOfRole(roleId) {
            getPermissionsOfRole(roleId).then(result => {
                if (result.code === '0000') {
                    this.$refs.tree.setCheckedNodes(result.data)
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
                                let id = result.data.id
                                let permissions = this.$refs.tree.getCheckedNodes()
                                createPermissionsToRole(id, permissions).then(result => {
                                    if (result.code === '0000') {
                                        this.getRoles()
                                        this.editMode = ''
                                        ElMessage.success("新增成功！")
                                    }
                                })
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateRole(this.role).then(result => {
                            if (result.code === '0000') {
                                let id = this.role.id
                                let permissions = this.$refs.tree.getCheckedNodes()
                                updatePermissionsOfRole(id, permissions).then(result => {
                                    if (result.code === '0000') {
                                        this.editMode = ''
                                        ElMessage.success("更新成功！")
                                    }
                                })
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
            this.getPermissionsOfRole(row.id)
            this.editMode = 'update'
            this.role = row
        },
        deleteRole(row) {
            ElMessageBox.confirm("确定删除？").then(() => {
                deleteRole(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.roles.indexOf(row)
                        this.roles.splice(index, 1)
                        ElMessage.success("删除成功！")
                    }
                })
            }).catch(() => {
                ElMessage.warning("已取消！")
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