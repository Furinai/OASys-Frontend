<template>
    <div v-if="editMode === 'create' || editMode === 'update'">
        <el-form ref="announcement" :model="announcement" :rules="rules">
            <el-form-item prop="title">
                <el-input v-model="announcement.title" maxlength="100" placeholder="标题" show-word-limit type="text"/>
            </el-form-item>
            <el-form-item prop="content">
                <el-input v-model="announcement.content" :autosize="{minRows: 6}" maxlength="2000"
                          minlength="10" placeholder="内容" show-word-limit type="textarea"/>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button :loading="loading" type="primary" @click="onSubmit('announcement')">
                    确认
                </el-button>
                <el-button @click="editMode = ''">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-table ref="table" :data="announcements" border style="width: 100%" tooltipEffect="light">
            <el-table-column align="center" label="标题" prop="title" show-overflow-tooltip width="600"/>
            <el-table-column align="center" label="创建时间" prop="createTime"/>
            <el-table-column align="center" label="修改时间" prop="updateTime"/>
            <el-table-column align="center" label="操作" width="100px">
                <template #header #default="scope">
                    <el-button type="primary" @click="createAnnouncement">新增</el-button>
                </template>
                <template #default="scope">
                    <el-dropdown trigger="click" @command="handleCommand($event,scope.row)">
                        <el-icon :size="20">
                            <operation/>
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updateAnnouncement">编辑</el-dropdown-item>
                                <el-dropdown-item command="deleteAnnouncement">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :hide-on-single-page="true" :pager-count="5" :total="size" background class="pagination"
                       layout="prev, pager, next" @current-change="handlePageChange">
        </el-pagination>
    </div>
</template>

<script>
import {createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement} from '../utils/api'
import {ElMessage, ElMessageBox} from 'element-plus'

export default {
    name: "Announcement-Manage",
    data() {
        return {
            announcement: {},
            announcements: [],
            size: 0,
            currentPage: 1,
            editMode: '',
            loading: false,
            rules: {
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'},
                    {min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur'}
                ],
                content: [
                    {required: true, message: '请输入内容', trigger: 'blur'},
                    {min: 5, max: 2000, message: '长度在 5 到 2000 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getAnnouncements()
    },
    methods: {
        getAnnouncements() {
            getAnnouncements({pageNumber: this.currentPage}).then(result => {
                if (result.code === '0000') {
                    this.announcements = result.data.list
                    this.size = result.data.size
                    this.$refs.table.doLayout()
                }
            })
        },
        onSubmit(announcement) {
            this.$refs[announcement].validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.editMode === 'create') {
                        createAnnouncement(this.announcement).then(result => {
                            if (result.code === '0000') {
                                this.$refs[announcement].resetFields()
                                ElMessage.success("发布成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                    if (this.editMode === 'update') {
                        updateAnnouncement(this.announcement).then(result => {
                            if (result.code === '0000') {
                                this.editMode = ''
                                ElMessage.success("更新成功！")
                            }
                        }).finally(() => this.loading = false)
                    }
                }
            })
        },
        createAnnouncement() {
            this.editMode = 'create'
            this.announcement = {}
        },
        updateAnnouncement(row) {
            this.editMode = 'update'
            this.announcement = row
        },
        deleteAnnouncement(row) {
            ElMessageBox.confirm("确定删除？").then(() => {
                deleteAnnouncement(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.announcements.indexOf(row)
                        this.announcements.splice(index, 1)
                        ElMessage.success("删除成功！")
                    }
                })
            }).catch(() => {
                ElMessage.warning("已取消！")
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case "updateAnnouncement":
                    this.updateAnnouncement(row)
                    break
                case "deleteAnnouncement":
                    this.deleteAnnouncement(row)
                    break
            }
        },
        handlePageChange(value) {
            this.currentPage = value
            this.getAnnouncements()
        }
    }
}
</script>