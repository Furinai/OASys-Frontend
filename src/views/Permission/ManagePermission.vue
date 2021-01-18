<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form :model="permission" :rules="rules" ref="permission" label-width="80px">
            <el-form-item prop="name" label="名称">
                <el-input type="text" v-model="permission.name" placeholder="名称" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item v-if="editMode === 'create'" prop="type" label="类型" @change="onTypeChange">
                <el-radio v-model="permission.type" label="category" border>分类</el-radio>
                <el-radio v-model="permission.type" label="menu" border>菜单</el-radio>
                <el-radio v-model="permission.type" label="resource" border>资源</el-radio>
            </el-form-item>
            <div v-if="permission.type === 'category'">
                <el-form-item prop="icon" label="图标">
                    <el-input type="text" v-model="permission.icon" placeholder="图标" maxlength="40" show-word-limit/>
                </el-form-item>
            </div>
            <div v-if="permission.type === 'menu'">
                <el-form-item prop="icon" label="图标">
                    <el-input type="text" v-model="permission.icon" placeholder="图标" maxlength="40" show-word-limit/>
                </el-form-item>
                <el-form-item v-if="editMode === 'create'" prop="parentId" label="分类">
                    <el-select v-model="permission.parentId">
                        <el-option v-for="category in categories" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="routerName" label="路由名称">
                    <el-input type="text" v-model="permission.routerName" placeholder="路由名称" maxlength="40" show-word-limit/>
                </el-form-item>
                <el-form-item prop="routerPath" label="路由路径">
                    <el-input type="text" v-model="permission.routerPath" placeholder="路由路径" maxlength="40" show-word-limit/>
                </el-form-item>
                <el-form-item prop="componentPath" label="组件路径">
                    <el-input type="text" v-model="permission.componentPath" placeholder="组件路径" maxlength="40" show-word-limit/>
                </el-form-item>
            </div>
            <div v-if="permission.type === 'resource'">
                <el-form-item v-if="editMode === 'create'" prop="parentId" label="菜单">
                    <el-select v-model="permission.parentId">
                        <el-option v-for="menu in menus" :label="menu.name" :value="menu.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="resourcePath" label="资源路径">
                    <el-input type="text" v-model="permission.resourcePath" placeholder="资源路径" maxlength="40" show-word-limit/>
                </el-form-item>
                <el-form-item prop="requestMethod" label="请求方法">
                    <el-radio v-model="permission.requestMethod" label="GET">GET</el-radio>
                    <el-radio v-model="permission.requestMethod" label="POST">POST</el-radio>
                    <el-radio v-model="permission.requestMethod" label="PUT">PUT</el-radio>
                    <el-radio v-model="permission.requestMethod" label="DELETE">DELETE</el-radio>
                </el-form-item>
            </div>
            <el-form-item class="text-right">
                <el-button size="small" @click="onSubmit('permission')" type="primary" :loading="loading">
                    确认
                </el-button>
                <el-button size="small" @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="permissions" style="width: 100%" size="medium" row-key="id" max-height="1000px" border>
            <el-table-column prop="name" label="名称" align="left" width="160"/>
            <el-table-column prop="icon" label="图标" align="center" width="50">
                <template #default="scope">
                    <el-icon :class=scope.row.icon></el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="routerName" label="路由名称" align="center" width="180"/>
            <el-table-column prop="routerPath" label="路由路径" align="center" width="180"/>
            <el-table-column prop="componentPath" label="组件路径" align="center"/>
            <el-table-column prop="resourcePath" label="资源路径" align="center" width="150"/>
            <el-table-column prop="requestMethod" label="请求方法" align="center" width="100"/>
            <el-table-column label="操作" align="center" width="100">
                <template #header #default="scope">
                    <el-button type="primary" size="mini" @click="createPermission">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
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
import {createPermission, deletePermission, getPermissions, updatePermission} from "/src/utils/api";

export default {
    name: "ManagePermission",
    data() {
        return {
            permission: {},
            permissions: [],
            categories: [],
            menus: [],
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
                    this.categories = []
                    this.menus = []
                    for (const permission of this.permissions) {
                        this.categories.push(permission)
                        if (permission.children) {
                            this.menus.push(...permission.children)
                        }
                    }
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
                                this.$message.success("新增成功！")
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
                                this.$message.success("更新成功！")
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
            this.$confirm("确定删除？").then(() => {
                deletePermission(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.permissions.indexOf(row)
                        this.permissions.splice(index, 1)
                        this.$message.success("删除成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning("已取消！")
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