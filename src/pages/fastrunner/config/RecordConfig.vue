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
                    ></el-button>

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
                checked: false,
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
