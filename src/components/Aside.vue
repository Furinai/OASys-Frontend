<template>
    <div class="aside">
        <el-menu active-text-color="#409EFF" background-color="#304156" router
                 text-color="#BFCBD9" unique-opened>
            <el-scrollbar style="height: 100%;">
                <el-menu-item :route="{name: 'Index'}" index="0">
                    <el-icon>
                        <house/>
                    </el-icon>
                    <template #title>首页</template>
                </el-menu-item>
                <el-sub-menu v-for="(category, i) in permissions" :index="i + ''">
                    <template #title>
                        <el-icon>
                            <component :is="category.icon" v-if="category.icon"/>
                        </el-icon>
                        {{ category.name }}
                    </template>
                    <el-menu-item v-for="(menu, j) in category.children"
                                  :index="i + '-' + j" :route="{name: menu.routerName}">
                        <el-icon>
                            <component :is="menu.icon" v-if="menu.icon"/>
                        </el-icon>
                        {{ menu.name }}
                    </el-menu-item>
                </el-sub-menu>
            </el-scrollbar>
        </el-menu>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: "Aside",
    computed: mapState([
        "auth",
        "permissions"
    ])
}
</script>

<style>
.aside {
    height: 100%;
}
</style>