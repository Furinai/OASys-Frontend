<template>
    <div class="files">
        <el-card shadow="never">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(path,index) in paths" :key="path.id">
                    <span @click="jumpToFolder(index)">
                            {{ path.name }}
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-form :inline="true">
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-top" @click="returnParentFolder" plain>返回上级</el-button>
                    <el-button type="primary" icon="el-icon-folder-add" @click="createFolder" plain>新建文件夹</el-button>
                    <el-button type="primary" icon="el-icon-upload" @click="uploadFile" plain>上传文件</el-button>
                </el-button-group>
            </el-form-item>

            <el-form-item class="search">
                <el-input v-model="keyword" placeholder="输入关键字搜索"></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="files.filter(data => !keyword || data.name.toLowerCase().includes(keyword.toLowerCase()))"
                  @row-click="enterFolder" @row-contextmenu="openContextMenu" border style="width: 100%" empty-text="空文件夹">
            <el-table-column prop="name" label="名称" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="100"/>
            <el-table-column prop="size" label="大小" align="center" width="100"/>
            <el-table-column prop="userName" label="创建者" align="center" width="150"/>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200"/>
            <el-table-column prop="updateTime" label="修改时间" align="center" width="200"/>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand($event,scope.row)">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="scope.row.type!=='文件夹'" command="downloadFile">下载</el-dropdown-item>
                            <el-dropdown-item command="rename">重命名</el-dropdown-item>
                            <el-dropdown-item command="remove">删除</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.shared" command="cancelShare">取消分享</el-dropdown-item>
                            <el-dropdown-item v-else command="shareFile">分享</el-dropdown-item>
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
        <el-dialog :visible.sync="uploadDialog" append-to-body>
            <el-upload action="" :http-request="doUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import {createFolder, downloadFile, getFiles, remove, update, uploadFile} from "@/utils/api";
import {mapState} from "vuex";

export default {
    name: 'PublicNetDisk',
    data() {
        return {
            files: [],
            size: 0,
            keyword: '',
            uploadDialog: false,
            paths: [{id: 0, name: '根目录'}],
        }
    },
    created() {
        this.getFiles(0)
    },
    computed: mapState([
        "auth"
    ]),
    methods: {
        getFiles(parentId, pageNumber) {
            getFiles({parentId, pageNumber}).then(response => {
                if (response && response.status === 200) {
                    this.files = response.data
                }
            })
        },
        enterFolder(row) {
            if (row.type === "文件夹") {
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
        openContextMenu(row, column, event) {
            event.preventDefault();
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
                        this.$message.success("创建文件夹成功！")
                        this.files.push(response.data)
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消新建文件夹！')
            });
        },
        uploadFile() {
            this.uploadDialog = true
        },
        doUpload(params) {
            let formData = new FormData();
            formData.append('multipartFile', params.file);
            formData.append('userId', this.auth.id);
            formData.append('userName', this.auth.name);
            formData.append('parentId', this.paths[this.paths.length - 1].id);
            uploadFile(formData).then(response => {
                if (response && response.status === 200) {
                    this.$message.success("上传成功！")
                }
            })
        },
        downloadFile(row) {
            downloadFile(row.id).then(response => {
                if (response.data) {
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new Blob([response.data]))
                    link.setAttribute('download', row.name);
                    link.click();
                }
            });
        },
        rename(row) {
            this.$prompt('请输入新文件名', '重命名', {
                inputValue: row.name,
                inputPattern: /^.{1,20}$/,
                inputErrorMessage: '文件名应为1-20个字符'
            }).then(({value}) => {
                update({id: row.id, name: value}).then(response => {
                    if (response && response.status === 200) {
                        row.name = value
                        this.$message.success("重命名成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消重命名！')
            });
        },
        remove(row) {
            this.$confirm('确定删除？', '删除').then(() => {
                remove(row.id).then(response => {
                    if (response && response.status === 200) {
                        let files = this.files;
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].id === row.id) {
                                files.splice(i, 1)
                            }
                        }
                        this.$message.success('删除成功！')
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消删除！')
            })
        },
        shareFile(row) {
            this.$confirm('确定分享？', '分享').then(() => {
                update({id: row.id, shared: true}).then(response => {
                    if (response && response.status === 200) {
                        row.shared = true
                        this.$message.success("分享成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消分享操作！')
            });
        },
        cancelShare(row) {
            this.$confirm('确定取消分享？', '取消分享').then(() => {
                update({id: row.id, shared: false}).then(response => {
                    if (response && response.status === 200) {
                        row.shared = false
                        this.$message.success("取消分享成功！")
                    }
                })
            }).catch(() => {
                this.$message.warning('已取消取消分享操作！')
            });
        },
        handleCommand(command, row) {
            switch (command) {
                case "downloadFile":
                    this.downloadFile(row)
                    break
                case "rename":
                    this.rename(row)
                    break
                case "remove":
                    this.remove(row)
                    break
                case "shareFile":
                    this.shareFile(row)
                    break
                case "cancelShare":
                    this.cancelShare(row)
                    break
            }
        },
        handlePageChange(pageNumber) {
            let parentId = this.paths[this.paths.length - 1].id;
            this.getFiles(parentId, pageNumber)
        }
    }
}
</script>