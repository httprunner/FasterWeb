<template>
    <el-container>
        <el-header style="padding: 0; height: 50px; border-top: 1px solid #ddd;">
            <div style="padding-top: 8px; padding-left: 10px;">
                <el-pagination
                    v-show="apiData.count !== 0 "
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="apiData.count"
                >
                </el-pagination>
            </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                <el-table
                    height="570"
                    ref="multipleTable"
                    :data="apiData.results"
                    :show-header="false"
                    :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="40"
                    >
                    </el-table-column>

                    <el-table-column
                        min-width="800"
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
        props: {
            node: {
                require: true
            },
            project: {
                require: true
            },
            checked:Boolean,
            del: Boolean
        },
        data() {
            return {
                selectAPI: [],
                currentRow: '',
                currentPage: 1,
                apiData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            node: function () {
                this.getAPIList();
            },
            checked: function () {
                if (this.checked) {
                    this.toggleAll();
                }else {
                    this.toggleClear();
                }
            },
            
            del: function () {
                if (this.selectAPI.length !== 0) {
                    this.$confirm('此操作将永久删除API，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllAPI({data:this.selectAPI}).then(resp => {
                            this.getAPIList();
                        }).catch(resp => {
                            this.$message.error({
                                message: '服务器连接超时，请重试',
                                duration: 1000
                            })
                        })
                    })
                }else {
                    this.$notify.warning({
                        title:'提示',
                        message: '请至少选择一个接口',
                        duration:1000
                    })
                }
            }
        },

        methods: {
            handleSelectionChange(val) {
                this.selectAPI = val;
            },

            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },

            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            // 查询api列表
            getAPIList() {
                this.$api.apiList({
                    params: {
                        node: this.node,
                        project: this.project
                    }
                }).then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },


            handleCurrentChange(val) {
                this.$api.getPaginationBypage({
                    params: {
                        page: this.currentPage,
                        node: this.node,
                        project: this.project
                    }
                }).then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
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
                        if (resp.success) {
                            this.getAPIList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                })
            },

            // 编辑API
            handleRowClick(row) {
                this.$api.getAPISingle(row.id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },
        }
    }
</script>

<style scoped>



</style>
