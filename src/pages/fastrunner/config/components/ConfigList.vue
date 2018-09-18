<template>
    <el-container>
        <el-header style="padding: 0; height: 50px; border-top: 1px solid #ddd;">
            <div style="padding-top: 8px; padding-left: 10px;">
                <el-pagination
                    v-show="configData.count !== 0 "
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="configData.count"
                >
                </el-pagination>
            </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                <el-table
                    ref="multipleTable"
                    :data="configData.results"
                    :show-header="configData.results.length !== 0 "
                    stripe
                    style="width: 100%"
                    height="630"
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>

                    <el-table-column
                        label="环境名称"
                        width="420"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.name}}</div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        width="300"
                        label="环境请求地址"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.base_url}}</div>

                        </template>
                    </el-table-column>

                    <el-table-column
                        width="300"
                    >
                        <template slot-scope="scope">
                            <el-row v-show="currentRow === scope.row">
                                <el-button
                                    type="info"
                                    icon="el-icon-edit"
                                    circle size="mini"
                                    @click="handleEditTest(scope.row.id)"
                                ></el-button>

                                <el-button
                                    type="primary"
                                    icon="el-icon-caret-right"
                                    circle size="mini"
                                ></el-button>

                                <el-button
                                    type="success"
                                    icon="el-icon-document"
                                    circle size="mini"
                                    @click="handleCopyTest(scope.row.id)"
                                >
                                </el-button>

                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle size="mini"
                                    @click="handleDelTest(scope.row.id)"
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
        name: "ConfigList",
        props: {
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
                configData: {
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
        },
        mounted() {
            this.$api.configList({params:{project: this.project}}).then(resp => {
                this.configData = resp;
            }).catch(resp => {
                this.$message.error({
                    message: '服务器连接超时，请重试',
                    duration: 1000
                })
            })
        }
    }
</script>

<style scoped>



</style>
