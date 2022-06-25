<template>
    <el-card :body-style="{padding:'15px'}" class="breadcrumb" shadow="never">
        <div class="flex-between">
            <div class="flex-start">
                <div class="breadcrumb-icon">
                    <el-icon>
                        <back @click="returnParentFolder"/>
                    </el-icon>
                </div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="(path, index) in paths">
                            <span @click="jumpToFolder(index)">
                                {{ path.name }}
                            </span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="flex-end breadcrumb-icon">
                <el-popover placement="left" trigger="hover">
                    <el-upload :http-request="upload" action="">
                        <el-icon>
                            <folder-opened/>
                        </el-icon>
                        选择并上传文件
                    </el-upload>
                    <template #reference>
                        <el-icon>
                            <upload/>
                        </el-icon>
                    </template>
                </el-popover>
                <el-icon>
                    <folder-add @click="createFolder"/>
                </el-icon>
            </div>
        </div>
    </el-card>
    <div class="flex-between search-box">
        <el-input v-model.trim="keyword" clearable @clear="resetData" @keyup.enter="searchFile()"></el-input>
        <el-button slot="append" :disabled="keyword === ''" icon="search" @click="searchFile()">
        </el-button>
    </div>
    <el-table ref="table" :data="files" border empty-text="空文件夹" style="width: 100%" @row-click="enterFolder">
        <el-table-column label="名称">
            <template #default="scope">
                <el-icon v-if="scope.row.type === '文件夹'" class="folder-icon">
                    <folder/>
                </el-icon>
                <el-icon v-else class="file-icon">
                    <document/>
                </el-icon>
                {{ scope.row.name }}
            </template>
        </el-table-column>
        <el-table-column align="center" label="类型" prop="type" width="100"/>
        <el-table-column align="center" label="大小" prop="size" width="100"/>
        <el-table-column align="center" label="创建者" prop="creator" width="150"/>
        <el-table-column align="center" label="创建时间" prop="createTime" width="200"/>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="200"/>
        <el-table-column align="center" label="操作" width="100">
            <template #default="scope">
                <el-dropdown @command="handleCommand($event, scope.row)">
                    <el-icon :size="20">
                        <operation/>
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="rename" icon="el-icon-edit">
                                重命名
                            </el-dropdown-item>
                            <el-dropdown-item command="remove" icon="el-icon-delete">
                                删除
                            </el-dropdown-item>
                            <el-dropdown-item :disabled="scope.row.type === '文件夹'" command="download"
                                              icon="el-icon-download">
                                下载
                            </el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.shared" command="stopShare" icon="el-icon-share">
                                停止分享
                            </el-dropdown-item>
                            <el-dropdown-item v-else command="share" icon="el-icon-share">
                                分享
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :hide-on-single-page="true" :pager-count="5" :total="size" background class="pagination"
                   layout="prev, pager, next" @current-change="handlePageChange">
    </el-pagination>
</template>

<script>
import {createFolder, deleteFile, downloadFile, getFiles, searchFile, updateFile, uploadFile} from '../utils/api'
import {ElMessage, ElMessageBox} from 'element-plus'
import {mapState} from 'vuex'

export default {
    name: 'File-Manage',
    data() {
        return {
            files: [],
            size: 0,
            currentPage: 1,
            keyword: '',
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
        getFiles(parentId) {
            getFiles({parentId, pageNumber: this.currentPage, userId: this.auth.id}).then(result => {
                if (result.code === '0000') {
                    this.files = result.data.list
                    this.size = result.data.size
                    this.$refs.table.doLayout()
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
            formData.append('creator', this.auth.fullName)
            formData.append('parentId', this.paths[this.paths.length - 1].id)
            uploadFile(formData).then(result => {
                if (result.code === '0000') {
                    ElMessage.success('上传成功！')
                    if (this.files.length === 10) {
                        this.files.splice(this.files.length - 1, 1)
                    }
                    this.files.push(result.data)
                }
            })
        },
        createFolder() {
            ElMessageBox.prompt('请输入文件夹名', '新建文件夹', {
                inputPattern: /^.{1,50}$/,
                inputErrorMessage: '文件夹名应为1-50个字符'
            }).then(({value}) => {
                let formData = new FormData()
                formData.append('name', value)
                formData.append('userId', this.auth.id)
                formData.append('creator', this.auth.fullName)
                formData.append('parentId', this.paths[this.paths.length - 1].id)
                createFolder(formData).then(result => {
                    if (result.code === '0000') {
                        ElMessage.success('创建文件夹成功！')
                        if (this.files.length === 10) {
                            this.files.splice(this.files.length - 1, 1)
                        }
                        this.files.push(result.data)
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消新建文件夹！')
            })
        },
        download(row) {
            ElMessageBox.prompt('请输入文件名', '下载', {
                inputValue: row.name,
                inputPattern: /^.{1,50}$/,
                inputErrorMessage: '文件名应为1-50个字符'
            }).then(({value}) => {
                downloadFile(row.id).then(result => {
                    if (result) {
                        let link = document.createElement('a')
                        let blob = new Blob([result], {type: 'application/octet-stream'})
                        link.href = window.URL.createObjectURL(blob)
                        link.setAttribute('download', value)
                        link.click()
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消下载！')
            })
        },
        rename(row) {
            ElMessageBox.prompt('请输入新文件名', '重命名', {
                inputValue: row.name,
                inputPattern: /^.{1,50}$/,
                inputErrorMessage: '文件名应为1-50个字符'
            }).then(({value}) => {
                updateFile({id: row.id, name: value}).then(result => {
                    if (result.code === '0000') {
                        row.name = value
                        ElMessage.success('重命名成功！')
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消重命名！')
            })
        },
        remove(row) {
            ElMessageBox.confirm('确定删除“ ' + row.name + ' ”？', '删除').then(() => {
                deleteFile(row.id).then(result => {
                    if (result.code === '0000') {
                        let index = this.files.indexOf(row)
                        this.files.splice(index, 1)
                        ElMessage.success('删除成功！')
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消删除！')
            })
        },
        share(row) {
            ElMessageBox.confirm('确定分享“ ' + row.name + ' ”？', '分享').then(() => {
                updateFile({id: row.id, shared: true}).then(result => {
                    if (result.code === '0000') {
                        row.shared = true
                        ElMessage.success('分享成功！')
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消分享！')
            })
        },
        stopShare(row) {
            ElMessageBox.confirm('确定停止分享“ ' + row.name + ' ”？', '停止分享').then(() => {
                updateFile({id: row.id, shared: false}).then(result => {
                    if (result.code === '0000') {
                        row.shared = false
                        ElMessage.success('停止分享成功！')
                    }
                })
            }).catch(() => {
                ElMessage.warning('已取消停止分享！')
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
        //todo 搜索结果分页
        handlePageChange(value) {
            this.currentPage = value
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId)
        },
        searchFile() {
            searchFile({name: this.keyword, pageNumber: this.currentPage - 1}).then(result => {
                if (result.code === '0000') {
                    this.files = result.data.list
                    this.size = result.data.size
                }
            })
        },
        resetData() {
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId)
        }
    }
}
</script>

<style scoped>
.breadcrumb {
    margin-bottom: 15px;
}

.breadcrumb-icon {
    font-size: 22px;
    margin: -4px 0 -10px;
}

.folder-icon {
    font-size: 16px;
    color: #E6A23C;
    margin-right: 5px;
}

.file-icon {
    font-size: 16px;
    color: #409EFF;
    margin-right: 5px;
}

.search-box {
    margin-bottom: 15px;
}
</style>