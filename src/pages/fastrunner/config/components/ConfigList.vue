<template>
    <el-container>
        <el-header style="padding: 0; height: 50px;">
            <div style="padding-top: 8px; padding-left: 10px;">
                <el-pagination
                    :page-size="11"
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
                <div style="position: fixed; bottom: 0; right:0; left: 200px; top: 150px">
                <el-table
                    :data="configData.results"
                    :show-header="configData.results.length !== 0 "
                    stripe
                    height="calc(100%)"
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
                        width="350"
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
                            <div v-text="scope.row.base_url === '' ? '无' : scope.row.base_url"></div>

                        </template>
                    </el-table-column>

                    <el-table-column
                        width="300"
                        label="更新时间"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.update_time|datetimeFormat}}</div>

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
                                    @click="handleEditConfig(scope.row)"
                                ></el-button>

                                <el-button
                                    type="success"
                                    icon="el-icon-document"
                                    circle size="mini"
                                    @click="handleCopyConfig(scope.row.id)"
                                >
                                </el-button>

                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle size="mini"
                                    @click="handleDelConfig(scope.row.id)"
                                >
                                </el-button>
                            </el-row>
                        </template>

                    </el-table-column>

                </el-table>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "ConfigList",
        props: {
            back:Boolean,
            project: {
                require: true
            },
            del: Boolean
        },
        data() {
            return {
                selectConfig: [],
                currentRow: '',
                currentPage: 1,
                configData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            back (){
                this.getConfigList();
            },

            del () {
                if (this.selectConfig.length !== 0) {
                    this.$confirm('此操作将永久删除环境，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllConfig({data:this.selectConfig}).then(resp => {
                            this.getConfigList();
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
                        message: '请至少选择一个环境',
                        duration:1000
                    })
                }
            }
        },

        methods: {
            handleSelectionChange(val) {
                this.selectConfig = val;
            },

            handleCurrentChange(val) {
                this.$api.getConfigPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.project
                    }
                }).then(resp => {
                    this.configData = resp;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            //删除api
            handleDelConfig(index) {
                this.$confirm('此操作将永久删除该环境，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteConfig(index).then(resp => {
                        if (resp.success) {
                            this.getConfigList();
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

            handleEditConfig(row) {
                this.$emit('respConfig', row);
            },

            handleCopyConfig(id) {
                this.$prompt('请输入环境名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '环境名称不能为空'
                }).then(({ value }) => {
                    this.$api.copyConfig(id, {
                        'name': value
                    }).then(resp => {
                        if (resp.success) {
                            this.getConfigList();
                        }else {
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

            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            getConfigList() {
                this.$api.configList({params:{project: this.project}}).then(resp => {
                    this.configData = resp;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },
        },
        mounted() {
           this.getConfigList();
        }
    }
</script>

<style scoped>



</style>
