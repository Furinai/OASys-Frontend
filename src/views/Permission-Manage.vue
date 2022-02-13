<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form ref="permission" :model="permission" :rules="rules" label-width="80px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="permission.name" maxlength="20" placeholder="名称" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item v-if="editMode === 'create'" label="类型" prop="type" @change="onTypeChange">
                <el-radio v-model="permission.type" border label="category">分类</el-radio>
                <el-radio v-model="permission.type" border label="menu">菜单</el-radio>
                <el-radio v-model="permission.type" border label="resource">资源</el-radio>
            </el-form-item>
            <div v-if="permission.type === 'category'">
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="permission.icon" maxlength="40" placeholder="图标" show-word-limit type="text"/>
                </el-form-item>
            </div>
            <div v-if="permission.type === 'menu'">
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="permission.icon" maxlength="40" placeholder="图标" show-word-limit type="text"/>
                </el-form-item>
                <el-form-item v-if="editMode === 'create'" label="分类" prop="parentId">
                    <el-select v-model="permission.parentId">
                        <el-option v-for="category in permissions" :label="category.name"
                                   :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路由名称" prop="routerName">
                    <el-input v-model="permission.routerName" maxlength="40" placeholder="路由名称" show-word-limit
                              type="text"/>
                </el-form-item>
                <el-form-item label="路由路径" prop="routerPath">
                    <el-input v-model="permission.routerPath" maxlength="40" placeholder="路由路径" show-word-limit
                              type="text"/>
                </el-form-item>
                <el-form-item label="组件路径" prop="componentPath">
                    <el-input v-model="permission.componentPath" maxlength="40" placeholder="组件路径" show-word-limit
                              type="text"/>
                </el-form-item>
            </div>
            <div v-if="permission.type === 'resource'">
                <el-form-item v-if="editMode === 'create'" label="菜单" prop="parentId">
                    <el-select v-model="permission.parentId">
                        <el-option-group v-for="permission in permissions" :key="permission.id"
                                         :label="permission.name">
                            <el-option v-for="menu in permission.children" :label="menu.name" :value="menu.id">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源路径" prop="resourcePath">
                    <el-input v-model="permission.resourcePath" maxlength="40" placeholder="资源路径" show-word-limit
                              type="text"/>
                </el-form-item>
                <el-form-item label="请求方法" prop="requestMethod">
                    <el-radio v-model="permission.requestMethod" label="GET">GET</el-radio>
                    <el-radio v-model="permission.requestMethod" label="POST">POST</el-radio>
                    <el-radio v-model="permission.requestMethod" label="PUT">PUT</el-radio>
                    <el-radio v-model="permission.requestMethod" label="DELETE">DELETE</el-radio>
                </el-form-item>
            </div>
            <el-form-item class="text-right">
                <el-button :loading="loading" type="primary" @click="onSubmit('permission')">
                    确认
                </el-button>
                <el-button @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="permissions" border max-height="1000px" row-key="id" style="width: 100%">
            <el-table-column align="left" label="名称" prop="name" width="160"/>
            <el-table-column align="center" label="图标" prop="icon" width="50">
                <template #default="scope">
                    <el-icon :class=scope.row.icon></el-icon>
                </template>
            </el-table-column>
            <el-table-column align="center" label="路由名称" prop="routerName" width="180"/>
            <el-table-column align="center" label="路由路径" prop="routerPath" width="180"/>
            <el-table-column align="center" label="组件路径" prop="componentPath"/>
            <el-table-column align="center" label="资源路径" prop="resourcePath" width="150"/>
            <el-table-column align="center" label="请求方法" prop="requestMethod" width="100"/>
            <el-table-column align="center" label="操作" width="100">
                <template #header #default="scope">
                    <el-button type="primary" @click="createPermission">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown trigger="click" @command="handleCommand($event,scope.row)">
                        <el-icon :size="20">
                            <operation/>
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updatePermission">编辑</el-dropdown-item>
                                <el-dropdown-item command="deletePermission">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {createPermission, deletePermission, getPermissions, updatePermission} from '../utils/api'
import {ElMessage, ElMessageBox} from 'element-plus'

export default {
    name: "Permission-Manage",
    data() {
        return {
            permission: {},
            permissions: [],
            editMode: '',
            loading: false,
            rules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '请选择类型', trigger: 'blur'}
                ],
                icon: [
                    {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'}
                ],
                parentId: [
                    {required: true, message: '请选择父级', trigger: 'blur'}
                ],
                routerName: [
                    {required: true, message: '请输入路由名称', trigger: 'blur'},
                    {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'}
                ],
                routerPath: [
                    {required: true, message: '请输入路由路径', trigger: 'blur'},
                    {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'}
                ],
                componentPath: [
                    {required: true, message: '请输入组件路径', trigger: 'blur'},
                    {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'}
                ],
                resourcePath: [
                    {required: true, message: '请输入资源路径', trigger: 'blur'},
                    {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'}
                ],
                requestMethod: [
                    {required: true, message: '请选择请求方法', trigger: 'change'}
                ]
            }
        }
    },
    created() {
        this.getPermissions()
    },
    methods: {
        getPermissions() {
            getPermissions({treeMode: true}).then(result => {
                if (result.code === '0000') {
                    this.permissions = result.data
                    this.$refs.table.doLayout()
                }
            })
        },
        onSubmit(permission) {
            this.$refs[permission].validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.editMode === 'create') {
                        if (this.permission.type === 'category') {
                            this.permission.parentId = 0
                        }
                        createPermission(this.permission).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                this.getPermissions()
                                ElMessage.success("新增成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        if (this.permission.type === 'category') {
                            this.permission.parentId = 0
                        }
                        updatePermission(this.permission).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                ElMessage.success("更新成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                }
            })
        },
        createPermission() {
            this.editMode = 'create'
            this.permission = {}
        },
        updatePermission(row) {
            this.editMode = 'update'
            this.permission = row
        },
        deletePermission(row) {
            ElMessageBox.confirm("确定删除？").then(() => {
                deletePermission(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.permissions.indexOf(row)
                        this.permissions.splice(index, 1)
                        ElMessage.success("删除成功！")
                    }
                })
            }).catch(() => {
                ElMessage.warning("已取消！")
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case "updatePermission":
                    this.updatePermission(row)
                    break
                case "deletePermission":
                    this.deletePermission(row)
                    break
            }
        },
        onTypeChange() {
            this.permission.parentId = null
        }
    }
}
</script>