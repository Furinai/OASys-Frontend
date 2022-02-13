<template>
    <div class="files">
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
            </div>
        </el-card>
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
                                <el-dropdown-item :disabled="scope.row.type === '文件夹'" command="download"
                                                  icon="el-icon-download">
                                    下载
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
    </div>
</template>

<script>
import {downloadFile, getFiles} from '../utils/api'
import {ElMessage, ElMessageBox} from 'element-plus'

export default {
    name: 'File-Shared-View',
    data() {
        return {
            files: [],
            size: 0,
            currentPage: 1,
            paths: [{id: 0, name: '根目录'}],
        }
    },
    created() {
        this.getFiles(0)
    },
    methods: {
        getFiles(parentId) {
            getFiles({parentId, pageNumber: this.currentPage, shared: true}).then(result => {
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
        download(row) {
            ElMessageBox.prompt('请输入文件名', '下载', {
                inputValue: row.name,
                inputPattern: /^.{1,20}$/,
                inputErrorMessage: '文件名应为1-20个字符'
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
        handleCommand(command, row) {
            if (command === 'download') {
                this.download(row)
            }
        },
        handlePageChange(value) {
            this.currentPage = value
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId)
        }
    }
}
</script>