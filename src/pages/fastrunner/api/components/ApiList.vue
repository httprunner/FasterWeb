<template>
    <el-container>
        <el-header style="padding: 0; height: 50px;">
            <div style=" padding-left: 10px;">
                <el-pagination
                    :page-size="11"
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
            <el-main style="padding: 0; margin-left: 10px;">
                <el-dialog
                    v-if="dialogTableVisible"
                    :visible.sync="dialogTableVisible"
                    width="70%"
                >
                    <report :summary="summary"></report>
                </el-dialog>

                <el-dialog
                    title="Run API"
                    :visible.sync="dialogTreeVisible"
                    width="45%"
                >
                    <div>
                        <div>
                            <el-row :gutter="2">
                                <el-col :span="8">
                                    <el-switch
                                        style="margin-top: 10px"
                                        v-model="asyncs"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="异步执行"
                                        inactive-text="同步执行">
                                    </el-switch>
                                </el-col>
                                <el-col :span="10">
                                    <el-input
                                        v-show="asyncs"
                                        clearable
                                        placeholder="请输入报告名称"
                                        v-model="reportName"
                                        :disabled="false">
                                    </el-input>

                                </el-col>
                            </el-row>
                        </div>
                        <div style="margin-top: 20px">
                            <el-input
                                placeholder="输入节点名称进行过滤"
                                v-model="filterText"
                                size="medium"
                                clearable
                                prefix-icon="el-icon-search"
                            >
                            </el-input>

                            <el-tree
                                :filter-node-method="filterNode"
                                :data="dataTree"
                                show-checkbox
                                node-key="id"
                                :expand-on-click-node="false"
                                check-on-click-node
                                :check-strictly="true"
                                :highlight-current="true"
                                ref="tree"
                            >
                            <span class="custom-tree-node"
                                  slot-scope="{ node, data }"
                            >
                                <span><i class="iconfont" v-html="expand"></i>&nbsp;&nbsp;{{ node.label }}</span>
                            </span>
                            </el-tree>
                        </div>

                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogTreeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="runTree">确 定</el-button>
                  </span>
                </el-dialog>


                <div style="position: fixed; bottom: 0; right:0; left: 480px; top: 160px">
                    <el-table
                        height="calc(100%)"
                        ref="multipleTable"
                        :data="apiData.results"
                        :show-header="false"
                        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        style="width: 100%;"
                        @selection-change="handleSelectionChange"
                        v-loading="loading"
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
                                        @click="handleRunAPI(scope.row.id)"
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
                </div>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Report from '../../../reports/DebugReport'

    export default {
        components: {
            Report
        },
        name: "ApiList",
        props: {
            config: {
                require: true
            },
            run: Boolean,
            back: Boolean,
            node: {
                require: true
            },
            project: {
                require: true
            },
            checked: Boolean,
            del: Boolean
        },
        data() {
            return {
                reportName: '',
                asyncs: false,
                filterText: '',
                loading: false,
                expand: '&#xe65f;',
                dataTree: {},
                dialogTreeVisible: false,
                dialogTableVisible: false,
                summary: {},
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
            filterText(val) {
                this.$refs.tree.filter(val);
            },

            run() {
                this.asyncs = false;
                this.reportName = "";
                this.getTree();
            },
            back() {
                this.getAPIList();
            },
            node() {
                this.getAPIList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },

            del() {
                if (this.selectAPI.length !== 0) {
                    this.$confirm('此操作将永久删除API，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllAPI({data: this.selectAPI}).then(resp => {
                            this.getAPIList();
                        }).catch(resp => {
                            this.$message.error({
                                message: '服务器连接超时，请重试',
                                duration: 1000
                            })
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个接口',
                        duration: 1000
                    })
                }
            }
        },

        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            runTree() {
                this.dialogTreeVisible = false;
                const relation = this.$refs.tree.getCheckedKeys();
                if (relation.length === 0) {
                    this.$notify.error({
                        title: '提示',
                        message: '请至少选择一个节点',
                        duration: 1500
                    });
                } else {
                    this.$api.runAPITree({
                        "project": this.project,
                        "relation": relation,
                        "config": this.config,
                        "async": this.asyncs,
                        "name": this.reportName
                    }).then(resp => {
                        if (resp.hasOwnProperty("status")) {
                            this.$message.info({
                                message: resp.msg,
                                duration: 1500
                            });
                        } else {
                            this.summary = resp;
                            this.dialogTableVisible = true;
                        }

                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                }
            },
            getTree() {
                this.$api.getTree(this.$route.params.id, {params: {type: 1}}).then(resp => {
                    this.dataTree = resp.tree;
                    this.dialogTreeVisible = true;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

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
            // 运行API
            handleRunAPI(id) {
                this.loading = true;
                this.$api.runAPIByPk(id, {params: {config: this.config}}).then(resp => {
                    this.summary = resp;
                    this.dialogTableVisible = true;
                    this.loading = false;
                }).catch(resp => {
                    this.loading = false;
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
