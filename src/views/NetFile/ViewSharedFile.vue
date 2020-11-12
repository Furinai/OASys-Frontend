<template>
    <div class="files">
        <el-card shadow="never" :body-style="{padding:'15px'}">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(path,index) in paths" :key="path.id">
                    <span @click="jumpToFolder(index)">
                            {{ path.name }}
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-table :data="files.filter(data => !keyword || data.name.toLowerCase().includes(keyword.toLowerCase()))"
                  @row-click="enterFolder" border style="width: 100%" empty-text="空文件夹">
            <el-table-column prop="name" label="名称" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="100"/>
            <el-table-column prop="size" label="大小" align="center" width="100"/>
            <el-table-column prop="userName" label="创建者" align="center" width="150"/>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200"/>
            <el-table-column prop="updateTime" label="修改时间" align="center" width="200"/>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-button @click="downloadFile(scope.row)"
                               :disabled="scope.row.type==='文件夹'">下载
                    </el-button>
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
import {downloadFile, getFiles} from "@/utils/api";

export default {
    name: 'ViewSharedFile',
    data() {
        return {
            files: [],
            size: 0,
            keyword: '',
            paths: [{id: 0, name: '根目录'}],
        }
    },
    created() {
        this.getFiles(0)
    },
    methods: {
        getFiles(parentId, pageNumber) {
            getFiles({parentId, pageNumber, shared: true}).then(response => {
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
        downloadFile(row) {
            downloadFile(row.id).then(response => {
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([response.data]))
                link.setAttribute('download', row.name)
                link.click()
            })
        },
        handlePageChange(pageNumber) {
            let parentId = this.paths[this.paths.length - 1].id
            this.getFiles(parentId, pageNumber)
        }
    }
}
</script>