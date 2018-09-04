<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px; border-top: 1px solid #ddd;">
                <div style="padding-top: 8px; padding-left: 10px;">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="8"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="apiData.count"
                        >
                        </el-pagination>
                </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px; margin-top: 10px">
                <el-table
                    ref="multipleTable"
                    :data="apiData.results"
                    :show-header="false"
                    highlight-current-row
                    :cell-style="{padding: 0, height: 50}"
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    style="width: 100%;"
                >
                    <el-table-column
                        type="selection"
                        width="40">
                    </el-table-column>

                    <el-table-column
                        min-width="900"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div class="block block_post" v-if="scope.row.method.toUpperCase() === 'POST' ">
                                <span class="block-method block_method_post block_method_color">POST</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_get" v-if="scope.row.method.toUpperCase() === 'GET' ">
                                <span class="block-method block_method_get block_method_color">GET</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_put" v-if="scope.row.method.toUpperCase() === 'PUT' ">
                                <span class="block-method block_method_put block_method_color">PUT</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_delete" v-if="scope.row.method.toUpperCase() === 'DELETE' ">
                                <span class="block-method block_method_delete block_method_color">DELETE</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_patch" v-if="scope.row.method.toUpperCase() === 'PATCH' ">
                                <span class="block-method block_method_patch block_method_color">PATCH</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_head" v-if="scope.row.method.toUpperCase() === 'HEAD' ">
                                <span class="block-method block_method_head block_method_color">HEAD</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                            <div class="block block_options" v-if="scope.row.method.toUpperCase()=== 'OPTIONS' ">
                                <span class="block-method block_method_options block_method_color">OPTIONS</span>
                                <span class="block-method block_url">{{scope.row.url}}</span>
                                <span class="block-summary-description">{{scope.row.name}}</span>
                            </div>

                        </template>
                    </el-table-column>

                    <el-table-column
                        width="140">
                        <template slot-scope="scope">
                            <el-row v-show="currentRow === scope.row">
                                <el-button
                                    type="info"
                                    icon="el-icon-edit"
                                    circle size="mini"
                                    @click="handleRowClick(scope.row)"
                                ></el-button>

                                <el-button
                                    type="primary"
                                    icon="el-icon-caret-right"
                                    circle size="mini"
                                ></el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle size="mini"
                                    @click="handleDelApi(scope.row.id)"
                                >
                                </el-button>
                            </el-row>

                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "ApiList",


        data() {
            return {
                currentRow: '',
                currentPage:1,
                apiData:[
                    {results:[]}
                ]
            }
        },

        methods: {
            // 查询api列表
            getAPIList() {
                this.$api.apiList().then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message:'服务器连接超时，请重试',
                        duration:1000
                    })
                })
            },


            handleCurrentChange(val) {
                this.$api.getSuitePaginationBypage(val).then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message:'服务器连接超时，请重试',
                        duration:1000
                    })
                })
            },

            //删除api
            handleDelApi(index) {
                this.$confirm('此操作将永久删除该API，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                   this.$api.delAPI(index).then(resp => {
                       if(resp.success) {
                           this.getAPIList();
                       }else{
                           this.$message.error(resp.msg);
                       }
                   }).catch(resp => {
                       this.$message.error({
                           message:'服务器连接超时，请重试',
                           duration:1000
                       })
                   })
                })
            },

            // 编辑API
            handleRowClick(row) {
                this.$api.getAPISingle(row.id).then(resp => {
                    if (resp.success) {
                       this.$emit('api', resp);
                    }else {
                        this.$message.error(resp.msg)
                    }
                }).catch(resp => {
                    this.$message.error({
                        message:'服务器连接超时，请重试',
                        duration:1000
                    })
                })
            },

            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },
        },

        mounted() {
            this.getAPIList();
        }
    }
</script>

<style scoped>

    .block_post {
        border: 1px solid #49cc90;
        background-color: rgba(73, 204, 144, .1)
    }

    .block_method_post {
        background-color: #49cc90;
    }

    .block_put {
        border: 1px solid #fca130;
        background-color: rgba(252, 161, 48, .1)
    }

    .block_method_put {
        background-color: #fca130;
    }

    .block_get {
        border: 1px solid #61affe;
        background-color: rgba(97, 175, 254, .1)
    }

    .block_method_get {
        background-color: #61affe;
    }

    .block_delete {
        border: 1px solid #f93e3e;
        background-color: rgba(249, 62, 62, .1)
    }

    .block_method_delete {
        background-color: #f93e3e;
    }

    .block_patch {
        border: 1px solid #50e3c2;
        background-color:rgba(80,227,194,.1)
    }

    .block_method_patch {
        background-color: #50e3c2;
    }

    .block_head {
        border: 1px solid #e6a23c;
        background-color:rgba(230,162,60,.1)
    }

    .block_method_head {
        background-color: #e6a23c;
    }

    .block_options {
        border: 1px solid #409eff;
        background-color:rgba(64,158,255,.1)
    }

    .block_method_options {
        background-color: #409eff;
    }

    .block {
        border-radius: 4px;
        height: 43.6px;
        margin:10px;
        padding: 5px;
        display: flex;
        align-items: center;
    }

    .block_url {
        color: inherit;
    }

    .block_method_color {
        cursor: pointer;
        color: #fff;
    }

    .block-method {
        font-size: 14px;
        font-weight: 600;
        min-width: 80px;
        padding: 6px 15px;
        text-align: center;
        border-radius: 3px;
        text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
        font-family: Titillium Web, sans-serif;
    }

    .block-summary-description {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        font-family: Open Sans, sans-serif;
        color: #3b4151;

    }

    .block_body {
        height: auto;
        margin-top: 0px;
        padding: 0px;
    }

    h4 {
        display: block;
        -webkit-margin-before: 1.33em;
        -webkit-margin-after: 1.33em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;
    }

</style>
