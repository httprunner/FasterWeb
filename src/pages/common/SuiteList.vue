<template>
    <div>
        <el-table
            :data="tableData.results"
            style="width: 100%"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
        >
            <el-table-column
                type="selection"
                width="40"
            >
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div v-for="item of props.row.step">
                        <div class="block block_post" v-if="item.method.toUpperCase() === 'POST' ">
                            <span class="block-method block_method_post block_method_color">POST</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_get" v-if="item.method.toUpperCase() === 'GET' ">
                            <span class="block-method block_method_get block_method_color">GET</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_put" v-if="item.method.toUpperCase() === 'PUT' ">
                            <span class="block-method block_method_put block_method_color">PUT</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_delete" v-if="item.method.toUpperCase() === 'DELETE' ">
                            <span class="block-method block_method_delete block_method_color">DELETE</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_patch" v-if="item.method.toUpperCase() === 'PATCH' ">
                            <span class="block-method block_method_patch block_method_color">PATCH</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_head" v-if="item.method.toUpperCase() === 'HEAD' ">
                            <span class="block-method block_method_head block_method_color">HEAD</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>

                        <div class="block block_options" v-if="item.method.toUpperCase()=== 'OPTIONS' ">
                            <span class="block-method block_method_options block_method_color">OPTIONS</span>
                            <span class="block-method block_url">{{item.url}}</span>
                            <span class="block-summary-description">{{item.name}}</span>
                        </div>
                    </div>


                </template>
            </el-table-column>
            <el-table-column
                label="Suite Name"
                prop="name">
            </el-table-column>
            <el-table-column
                label="Suite 描述"
                prop="desc">
            </el-table-column>

            <el-table-column
                label="更新时间"
                prop="update_time"
            >
            </el-table-column>

            <el-table-column
                width="140"
            >
                <template slot-scope="scope">
                    <el-row v-show="scope.row === currentRow">
                        <el-button
                            type="info"
                            icon="el-icon-edit"
                            circle size="mini"
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
                            @click="deleteSuite(scope.row)"
                        >
                        </el-button>
                    </el-row>

                </template>
            </el-table-column>
        </el-table>

        <div style="margin-right: 20px; margin-top: 20px" align="right">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="8"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SuiteList",
        methods: {
            getSuiteList() {
                this.$api.getSuiteList().then(resp => {
                    this.tableData = resp;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },
            deleteSuite(row) {
                this.$confirm('此操作将永久删除该Suite，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.delSuite(row.id).then(resp => {
                        this.getSuiteList();
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                })
            },

            handleCurrentChange(val) {
                this.$api.getSuitePaginationBypage(val).then(res => {
                    this.tableData = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            cellMouseEnter(row) {
                if (!row.step) {
                    const index = this.tableData.results.indexOf(row);
                    this.$api.getSuiteStep(row.id).then(resp => {
                        this.tableData.results[index].step = resp;
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })

                }
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

        },
        data() {
            return {
                currentPage: 1,
                tableData: [],
                currentRow: ''
            }
        },
        mounted() {
            this.getSuiteList();
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
        background-color: rgba(80, 227, 194, .1)
    }

    .block_method_patch {
        background-color: #50e3c2;
    }

    .block_head {
        border: 1px solid #e6a23c;
        background-color: rgba(230, 162, 60, .1)
    }

    .block_method_head {
        background-color: #e6a23c;
    }

    .block_options {
        border: 1px solid #409eff;
        background-color: rgba(64, 158, 255, .1)
    }

    .block_method_options {
        background-color: #409eff;
    }

    .block {
        border-radius: 4px;
        height: 43.6px;
        margin: 10px;
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
