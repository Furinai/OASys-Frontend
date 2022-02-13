<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form ref="dept" :model="dept" :rules="rules" label-width="80px">
            <el-form-item label="部门名" prop="name">
                <el-input v-model="dept.name" maxlength="20" placeholder="部门名" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item label="负责人" prop="principal">
                <el-input v-model="dept.principal" maxlength="20" placeholder="负责人" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item label="联系电话" prop="phoneNumber">
                <el-input v-model="dept.phoneNumber" maxlength="11" placeholder="联系电话" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button :loading="loading" type="primary" @click="onSubmit('dept')">
                    确认
                </el-button>
                <el-button @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="depts" border style="width: 100%">
            <el-table-column align="center" label="部门名" prop="name" width="200"/>
            <el-table-column align="center" label="负责人" prop="principal" width="200"/>
            <el-table-column align="center" label="联系电话" prop="phoneNumber" width="200"/>
            <el-table-column align="center" label="创建时间" prop="createTime"/>
            <el-table-column align="center" label="修改时间" prop="updateTime"/>
            <el-table-column align="center" label="操作" width="100">
                <template #header #default="scope">
                    <el-button type="primary" @click="createDept">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown trigger="click" @command="handleCommand($event,scope.row)">
                        <el-icon :size="20">
                            <operation/>
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updateDept">编辑</el-dropdown-item>
                                <el-dropdown-item command="deleteDept">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {createDept, deleteDept, getDepts, updateDept} from '../utils/api'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
    name: "Dept-Manage",
    data() {
        return {
            dept: {},
            depts: [],
            editMode: '',
            loading: false,
            rules: {
                name: [
                    {required: true, message: '请输入部门名', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                ],
                principal: [
                    {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                ],
                phoneNumber: [
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
                    this.$refs.table.doLayout()
                }
            })
        },
        onSubmit(dept) {
            this.$refs[dept].validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.editMode === 'create') {
                        createDept(this.dept).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                this.getDepts()
                                ElMessage.success("新增成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateDept(this.dept).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                ElMessage.success("更新成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                }
            })
        },
        createDept() {
            this.editMode = 'create'
            this.dept = {}
        },
        updateDept(row) {
            this.editMode = 'update'
            this.dept = row
        },
        deleteDept(row) {
            ElMessageBox.confirm("确定删除？").then(() => {
                deleteDept(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.depts.indexOf(row)
                        this.depts.splice(index, 1)
                        ElMessage.success("删除成功！")
                    }
                })
            }).catch(() => {
                ElMessage.warning("已取消！")
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case "updateDept":
                    this.updateDept(row)
                    break
                case "deleteDept":
                    this.deleteDept(row)
                    break
            }
        }
    }
}
</script>