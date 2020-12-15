<template>
    <div class="files">
        <el-card shadow="never" :body-style="{padding:'15px'}" class="breadcrumb">
            <div class="flex-between">
                <div class="flex-start">
                    <div class="breadcrumb-icon">
                        <i class="el-icon-back text-icon" @click="returnParentFolder"></i>
                    </div>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item v-for="(path, index) in paths" :key="path.id">
                            <span @click="jumpToFolder(index)">
                                {{ path.name }}
                            </span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="flex-end breadcrumb-icon">
                    <el-popover placement="left" trigger="hover">
                        <el-upload action="" :http-request="upload">
                            <i class="el-icon-folder-opened"></i>
                            选择并上传文件
                        </el-upload>
                        <i class="el-icon-upload text-icon" slot="reference"></i>
                    </el-popover>
                    <i class="el-icon-folder-add" @click="createFolder"></i>
                </div>
            </div>
        </el-card>
        <el-table :data="files" @row-click="enterFolder" style="width: 100%" empty-text="空文件夹" border>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <i v-if="scope.row.type === '文件夹'" class="el-icon-folder folder-icon"></i>
                    <i v-else class="el-icon-document file-icon"></i>
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="100"/>
            <el-table-column prop="size" label="大小" align="center" width="100"/>
            <el-table-column prop="userName" label="创建者" align="center" width="150"/>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200"/>
            <el-table-column prop="updateTime" label="修改时间" align="center" width="200"/>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand($event, scope.row)">
                        <i class="el-icon-s-operation"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-edit" command="rename">
                                重命名
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-delete" command="remove">
                                删除
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-download" :disabled="scope.row.type === '文件夹'" command="download">
                                下载
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-share" v-if="scope.row.shared" command="stopShare">
                                停止分享
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-share" v-else command="share">
                                分享
                            </el-dropdown-item>
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
</template>

<script>
import {createFolder, deleteFile, downloadFile, getFiles, updateFile, uploadFile} from "@/utils/api";
import {mapState} from "vuex";

export default {
    name: 'ManageFile',
    data() {
        return {
            files: [],
            size: 0,
            paths: [{id: 0, name: '根目录'}],
        }
    },
    created() {
        this.getFiles(0)
    },
    computed: mapState([
        'auth'
    ]),
    methods: {
        getFiles(parentId, pageNumber) {
            getFiles({parentId, pageNumber, userId: this.auth.id}).then(response => {
                if (response && response.status === 200) {
                    this.files = response.data
                    this.size = response.size
                }
            })
        },
        enterFolder(row, column) {
            if (row.type === '文件夹' && column.label !== '操作') {
                this.getFiles(row.id)
                this.paths.push({id: row.id, name: row.name})
            }
        },
        jumpToFolder(index) {
            if (index + 1 < this.paths.length) {
                this.getFiles(this.paths[index].id)
                this.paths.splice(index + 1)
            }
        },
        returnParentFolder() {
            if (this.paths.length > 1) {
                this.paths.pop()
                this.getFiles(this.paths[this.paths.length - 1].id)
            }
        },
        upload(params) {
            let formData = new FormData()
            formData.append('multipartFile', params.file)
            formData.append('userId', this.auth.id)
            formData.append('userName', this.auth.name)
            formData.append('parentId', this.paths[this.paths.length - 1].id)
            uploadFile(formData).then(response => {
                if (response && response.status === 201) {
                    this.$message.success('上传成功！')
                    if (this.files.length === 10) {
                        this.files.splice(this.files.length - 1, 1)
                    }
                    this.files.push(response.data)
                }
            })
        },
        createFolder() {
            this.$prompt('请输入文件夹名', '新建文件夹', {
                inputPattern: /^.{1,20}$/,
                inputErrorMessage: '文件夹名应为1-20个字符'
            }).then(({value}) => {
                let parentId = this.paths[this.paths.length - 1].id
                let userId = this.auth.id, userName = this.auth.name
                createFolder({name: value, userId, userName, parentId}).then(response => {
                    if (response && response.status === 201) {
                        this.$message.success('创建文件夹成功！')
                        if (this.files.length === 10) {
                            this.files.splice(this.files.length - 1, 1)
                        }
                        this.files.push(response.data)
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消新建文件夹！')
            })
        },
        download(row) {
            this.$prompt('请输入文件名', '下载', {
                inputValue: row.name,
                inputPattern: /^.{1,20}$/,
                inputErrorMessage: '文件名应为1-20个字符'
            }).then(({value}) => {
                downloadFile(row.id).then(response => {
                    if (response) {
                        let link = document.createElement('a')
                        let blob = new Blob([response], {type: 'application/octet-stream'})
                        link.href = window.URL.createObjectURL(blob)
                        link.setAttribute('download', value)
                        link.click()
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消下载！')
            })
        },
        rename(row) {
            this.$prompt('请输入新文件名', '重命名', {
                inputValue: row.name,
                inputPattern: /^.{1,20}$/,
                inputErrorMessage: '文件名应为1-20个字符'
            }).then(({value}) => {
                updateFile({id: row.id, name: value}).then(response => {
                    if (response && response.status === 200) {
                        row.name = value
                        this.$message.success('重命名成功！')
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消重命名！')
            })
        },
        remove(row) {
            this.$confirm('确定删除“ ' + row.name + ' ”？', '删除').then(() => {
                deleteFile(row.id).then(response => {
                    if (response && response.status === 200) {
                        let index = this.files.indexOf(row)
                        this.files.splice(index, 1)
                        this.$message.success('删除成功！')
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消删除！')
            })
        },
        share(row) {
            this.$confirm('确定分享“ ' + row.name + ' ”？', '分享').then(() => {
                updateFile({id: row.id, shared: true}).then(response => {
                    if (response && response.status === 200) {
                        row.shared = true
                        this.$message.success('分享成功！')
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消分享！')
            })
        },
        stopShare(row) {
            this.$confirm('确定停止分享“ ' + row.name + ' ”？', '停止分享').then(() => {
                updateFile({id: row.id, shared: false}).then(response => {
                    if (response && response.status === 200) {
                        row.shared = false
                        this.$message.success('停止分享成功！')
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消停止分享！')
            })
        },
        handleCommand(command, row) {
            switch (command) {
                case 'download':
                    this.download(row)
                    break
                case 'rename':
                    this.rename(row)
                    break
                case 'remove':
                    this.remove(row)
                    break
                case 'share':
                    this.share(row)
                    break
                case 'stopShare':
                    this.stopShare(row)
                    break
            }
        },
        handlePageChange(pageNumber) {
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId, pageNumber)
        }
    }
}
</script>