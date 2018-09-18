<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        type="warning"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="addConfigActivate=true"
                    >新增环境
                    </el-button>

                    <el-button
                        type="primary"
                        plain
                        size="small"
                        icon="el-icon-upload"
                    >导入环境
                    </el-button>

                    <el-button
                        type="info"
                        plain
                        size="small"
                        icon="el-icon-download"
                    >导出环境
                    </el-button>

                    <el-button
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="del= !del"
                    ></el-button>

                    <el-button
                        :disabled="!addConfigActivate"
                        type="text"
                        style="position: absolute; right: 30px;"
                        @click="addConfigActivate=false"
                    >返回列表</el-button>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <config-body
                    v-show="addConfigActivate"
                    :project="$route.params.id"
                >
                </config-body>

                <config-list
                    v-show="!addConfigActivate"
                    :project="$route.params.id"
                    :del="del"
                >
                </config-list>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import ConfigBody from './components/ConfigBody'
    import ConfigList from './components/ConfigList'

    export default {
        components: {
            ConfigBody,
            ConfigList
        },

        computed: {
        },
        data() {
            return {
                del: false,
                addConfigActivate: false
            }
        },
        methods: {

        },
        name: "RecordConfig",
        mounted() {

        }
    }
</script>

<style>


</style>
