<template>
    <div class="files">
        <el-form :inline="true">
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-top" @click="toParent" plain>返回上一级</el-button>
                    <el-button v-if="auth.role.id > 1 || personal == 1 " type="primary" icon="el-icon-folder-add"
                               @click="addFolder" plain>新建文件夹
                    </el-button>
                    <el-button type="primary" icon="el-icon-upload" @click="uploadFile" plain>上传文件</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="downloadFile" plain>下载文件</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="renameFile" plain>重命名</el-button>
                    <el-button v-if="auth.role.id > 1 || personal == 1 "
                               type="primary" icon="el-icon-delete" @click="deleteFile" plain>删除
                    </el-button>
                </el-button-group>
            </el-form-item>
            <el-form-item class="search">
                <el-input v-model="search" placeholder="输入关键字搜索"></el-input>
            </el-form-item>
            <el-form-item class="path">
                <el-input v-model="currentPath" :disabled="true"/>
            </el-form-item>
        </el-form>
        <el-table :data="files.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                  border ref="multipleTable" style="width: 100%">
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="100">
            </el-table-column>
            <el-table-column
                    label="名称"
                    align="center"
                    width="400">
                <template slot-scope="scope">
                    <div v-if="scope.row.type === '文件夹'">
                        <span @click="toFolder(scope.row)">
                            {{ scope.row.name }}
                        </span>
                    </div>
                    <div v-else>
                        {{ scope.row.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    align="center"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小"
                    align="center"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="user.username"
                    label="作者"
                    align="center"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :pager-count="5" :total="total"
                           :hide-on-single-page="true" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="addFolderDialog">
            <el-form>
                <el-form-item label="文件夹名称" label-width="85px">
                    <el-input v-model="folderName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addFolderDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitAddFolder">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="uploadFileDialog" width="26%">
            <el-upload drag action="/api/uploadFile" multiple :data={personal,parentId}
                       :on-success="uploadSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
        <el-dialog :visible.sync="renameFileDialog">
            <el-form>
                <el-form-item label="名称" label-width="40px">
                    <el-input v-model="newName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="renameFileDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitRenameFile">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {addFolder, getFiles, renameFile, deleteFile} from "../utils/api";
    import {mapState} from 'vuex'

    export default {
        name: "Files",
        data() {
            return {
                total: 0,
                files: [],
                search: "",
                history: [],
                current: [1],
                selection: [],
                newName: "",
                folderName: "",
                path: [" / 根目录"],
                addFolderDialog: false,
                uploadFileDialog: false,
                renameFileDialog: false,
            }
        },
        props: [
            'personal'
        ],
        created() {
            this.getFiles(1);
        },
        computed: {
            currentPath() {
                return this.path.join(" / ")
            },
            parentId() {
                return this.current[this.current.length - 1];
            },
            ...mapState(['auth'])
        },
        methods: {
            getFiles(parentId, pageNumber) {
                var personal = this.personal
                getFiles({parentId, personal, pageNumber}).then(response => {
                    if (response && response.status === 'success') {
                        this.total = response.total;
                        this.files = response.object;
                    }
                })
            },
            toFolder(file) {
                this.getFiles(file.id);
                this.path.push(file.name);
                this.current.push(file.id);
                this.history.push(file.parentId);
            },
            toParent() {
                if (this.history.length === 0) {
                    this.$message.error("已经是根目录")
                } else {
                    this.getFiles(this.history.pop());
                    this.current.pop();
                    this.path.pop();
                }
            },
            addFolder() {
                this.addFolderDialog = true
            },
            submitAddFolder() {
                var personal = this.personal;
                var folderName = this.folderName;
                var parentId = this.current[this.current.length - 1];
                if (folderName === null || folderName.trim() === "") {
                    this.$message.error("文件夹名称不能为空！")
                } else {
                    addFolder({folderName, personal, parentId}).then(response => {
                        if (response && response.status === 'success') {
                            this.$message.success(response.message)
                            this.getFiles(parentId)
                            this.addFolderDialog = false
                            this.folderName = null
                        }
                    })
                }
            },
            uploadFile() {
                this.uploadFileDialog = true
            },
            uploadSuccess(response) {
                this.$message.success(response.message);
                this.getFiles(this.current[this.current.length - 1])
                this.uploadFileDialog = false
            },
            handleCurrentChange(pageNumber) {
                var parentId = this.current[this.current.length - 1];
                this.getFiles(parentId, pageNumber);
            },
            downloadFile() {
                this.$refs.multipleTable.selection.forEach((item) => {
                    if (item.type !== "文件夹") {
                        var link = document.createElement('a');
                        var name = item.name + '.' + item.type;
                        link.setAttribute("download", name);
                        link.href = item.path;
                        link.click();
                    }
                })
            },
            renameFile() {
                this.selection = this.$refs.multipleTable.selection
                this.renameFileDialog = true
            },
            submitRenameFile() {
                if (this.selection.length < 1) {
                    this.$message.error("至少选择一个文件或文件夹！")
                } else if (this.selection.length > 1) {
                    this.$message.error("一次只能对一个文件或文件夹重命名！")
                } else {
                    var newName = this.newName;
                    var id = this.selection[0].id
                    renameFile({id, newName}).then(response => {
                        if (response && response.status === 'success') {
                            this.$message.success(response.message);
                            this.getFiles(this.files[0].parentId)
                            this.renameFileDialog = false
                            this.newName = null
                        }
                    })
                }
            },
            deleteFile() {
                this.$confirm('永久删除这些文件, 是否继续?')
                    .then(() => {
                        if (this.$refs.multipleTable.selection < 1) {
                            this.$message.error("至少选择一个文件或文件夹！")
                        } else {
                            var ids = [];
                            this.$refs.multipleTable.selection.forEach(item => {
                                ids.push(item.id)
                            })
                            deleteFile(ids).then(response => {
                                if (response && response.status === 'success') {
                                    this.$message.success(response.message);
                                    this.getFiles(this.current[this.current.length - 1])
                                }
                            })
                        }
                    })
                    .catch(() => {
                        this.$message.info('已取消删除')
                    });
            }
        }
    }
</script>

<style scoped>
    .path {
        float: right
    }

    .search {
        float: right
    }
</style>