<template>
    <div class="files">
        <el-card shadow="never" :body-style="{padding:'15px'}" class="breadcrumb">
            <div class="flex-between">
                <div class="flex-start">
                    <div class="breadcrumb-icon">
                        <i class="el-icon-back text-icon" @click="returnParentFolder"></i>
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
        <el-table :data="files" @row-click="enterFolder" style="width: 100%" empty-text="空文件夹" border>
            <el-table-column label="名称">
                <template #default="scope">
                    <i v-if="scope.row.type === '文件夹'" class="el-icon-folder folder-icon"></i>
                    <i v-else class="el-icon-document file-icon"></i>
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="100"/>
            <el-table-column prop="size" label="大小" align="center" width="100"/>
            <el-table-column prop="creator" label="创建者" align="center" width="150"/>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200"/>
            <el-table-column prop="updateTime" label="修改时间" align="center" width="200"/>
            <el-table-column label="操作" align="center" width="100">
                <template #default="scope">
                    <el-dropdown @command="handleCommand($event, scope.row)">
                        <i class="el-icon-s-operation"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item icon="el-icon-download" command="download"
                                                  :disabled="scope.row.type === '文件夹'">
                                    下载
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
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
import {downloadFile, getFiles} from "/src/utils/api";

export default {
    name: 'ViewSharedFile',
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
    methods: {
        getFiles(parentId, pageNumber) {
            getFiles({parentId, pageNumber, shared: true}).then(result => {
                if (result && result.code === 200) {
                    this.files = result.data
                    this.size = result.size
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
            this.$prompt('请输入文件名', '下载', {
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
                this.$message.warning('已取消下载！')
            })
        },
        handleCommand(command, row) {
            if (command === 'download') {
                this.download(row)
            }
        },
        handlePageChange(pageNumber) {
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId, pageNumber)
        }
    }
}
</script>