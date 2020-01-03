<template>
    <div class="files">
        <el-form :inline="true">
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-top" @click="toParent" plain>返回上一级</el-button>
                    <el-button v-if="auth.role.id > 1 || personal == 1 " type="primary"
                               icon="el-icon-folder-add" @click="addFolder" plain>新建文件夹
                    </el-button>
                    <el-button type="primary" icon="el-icon-upload" plain>上传文件</el-button>
                    <el-button type="primary" icon="el-icon-download" plain>下载文件</el-button>
                    <el-button type="primary" icon="el-icon-edit" plain>重命名</el-button>
                    <el-button v-if="auth.role.id > 1 || personal == 1 "
                               type="primary" icon="el-icon-delete" plain>删除
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
                  border style="width: 100%">
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
                    <div v-if="scope.row.type=='文件夹'">
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
    </div>
</template>

<script>
    import {addFolder, getFiles} from "../utils/api";
    import {mapState} from 'vuex'

    export default {
        name: "Files",
        data() {
            return {
                total: 0,
                files: [],
                search: "",
                history: [],
                path: ["/ 根目录"],
                folderName: "",
                addFolderDialog: false,
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
                return (this.path.join(" / "))
            },
            ...mapState(['auth'])
        },
        methods: {
            getFiles(parentId, pageNumber) {
                var userId = this.auth.id;
                var personal = this.personal
                getFiles({parentId, userId, personal, pageNumber}).then(response => {
                        if (response && response.status === 'success') {
                            this.total = response.total;
                            this.files = response.object;
                        }
                    }
                )
            },
            toFolder(file) {
                this.getFiles(file.id);
                this.path.push(file.name);
                this.history.push(file.parentId);
            },
            toParent() {
                if (this.path.length === 1) {
                    this.$message.error("已经是根目录")
                } else {
                    var parentId = this.history.pop();
                    this.getFiles(parentId);
                    this.path.pop();
                }
            },
            addFolder() {
                this.addFolderDialog = true
            },
            submitAddFolder() {
                var userId = this.auth.id;
                var personal = this.personal;
                var folderName = this.folderName;
                var parentId = this.files[0].parentId;
                addFolder({folderName, userId, personal, parentId}).then(response => {
                    if (response && response.status === 'success') {
                        this.$message.success(response.message)
                    }
                })
                this.addFolderDialog = false
                this.getFiles(1)
            },
            handleCurrentChange(pageNumber) {
                var parentId = this.history.slice(-1)
                parentId = this.history.length === 0 ? 1 : parentId
                this.getFiles(parentId, pageNumber);
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