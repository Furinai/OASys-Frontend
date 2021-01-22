<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form :model="dept" :rules="rules" ref="dept" label-width="80px">
            <el-form-item prop="name" label="部门名">
                <el-input type="text" v-model="dept.name" placeholder="部门名" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item prop="principal" label="负责人">
                <el-input type="text" v-model="dept.principal" placeholder="负责人" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item prop="phoneNumber" label="联系电话">
                <el-input type="text" v-model="dept.phoneNumber" placeholder="联系电话" maxlength="11" show-word-limit/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button size="small" @click="onSubmit('dept')" type="primary" :loading="loading">
                    确认
                </el-button>
                <el-button size="small" @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="depts" style="width: 100%" size="medium" border>
            <el-table-column prop="name" label="部门名" align="center" width="200"/>
            <el-table-column prop="principal" label="负责人" align="center" width="200"/>
            <el-table-column prop="phoneNumber" label="联系电话" align="center" width="200"/>
            <el-table-column prop="createTime" label="创建时间" align="center"/>
            <el-table-column prop="updateTime" label="修改时间" align="center"/>
            <el-table-column label="操作" align="center" width="100">
                <template #header #default="scope">
                    <el-button type="primary" size="mini" @click="createDept">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
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
import {createDept, deleteDept, getDepts, updateDept} from '/@/utils/api'

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
        getDepts(pageNumber) {
            getDepts({pageNumber}).then(result => {
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
                                this.$message.success("新增成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateDept(this.dept).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                this.$message.success("更新成功！")
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
            this.$confirm("确定删除？").then(() => {
                deleteDept(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.depts.indexOf(row)
                        this.depts.splice(index, 1)
                        this.$message.success("删除成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning("已取消！")
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