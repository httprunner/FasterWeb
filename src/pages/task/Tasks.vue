<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="addTasks=true"
                    >添加任务
                    </el-button>

                    <el-button
                        :disabled="!addTasks"
                        type="text"
                        style="position: absolute; right: 30px;"
                        @click="addTasks=false"
                    >返回列表
                    </el-button>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-header v-if="!addTasks" style="padding: 0; height: 50px; margin-top: 10px">
                <div style="padding-top: 8px; padding-left: 30px;">
                    <el-pagination
                        :page-size="11"
                        v-show="tasksData.count !== 0 "
                        background
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        layout="total, prev, pager, next, jumper"
                        :total="tasksData.count"
                    >
                    </el-pagination>
                </div>
            </el-header>
            <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                <div style="position: fixed; bottom: 0; right:0; left: 230px; top: 160px">
                    <el-table
                        v-if="!addTasks"
                        :data="tasksData.results"
                        :show-header="tasksData.results.length !== 0 "
                        stripe
                        highlight-current-row
                        height="calc(100%)"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                    >

                        <el-table-column
                            label="任务名称"
                            width="240"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>


                        <el-table-column
                            width="120"
                            label="时间配置"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.kwargs.corntab}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="邮件策略"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.kwargs.strategy}}</div>

                            </template>
                        </el-table-column>


                        <el-table-column
                            width="80"
                            label="状态"
                        >
                            <template slot-scope="scope">
                                <el-switch
                                    disabled
                                    v-model="scope.row.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="320"
                            label="接收人"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.kwargs.receiver}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="320"
                            label="抄送人"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.kwargs.copy}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="200"
                        >
                            <template slot-scope="scope">
                                <el-row v-show="currentRow === scope.row">
                                    <el-button
                                        type="info"
                                        icon="el-icon-edit"
                                        circle size="mini"
                                    ></el-button>
                                    <el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        circle size="mini"
                                        @click="delTasks(scope.row.id)"
                                    >
                                    </el-button>
                                </el-row>
                            </template>

                        </el-table-column>

                    </el-table>
                </div>
            </el-main>
            <add-tasks
                v-if="addTasks"
                v-on:changeStatus="changeStatus"
            >
            </add-tasks>
        </el-container>
    </el-container>

</template>

<script>
    import AddTasks from './AddTasks'

    export default {
        components: {
            AddTasks
        },
        data() {
            return {
                addTasks: false,
                currentPage: 1,
                currentRow: '',
                tasksData: {
                    count: 0,
                    results: []
                },
            }
        },
        methods: {
            delTasks(id) {
                this.$confirm('此操作将永久删除该定时任务，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteTasks(id).then(resp => {
                        if (resp.success) {
                            this.getTaskList();
                        }
                    })
                })
            },
            handleCurrentChange(val) {
                this.$api.getTaskPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id
                    }
                }).then(resp => {
                    this.tasksData = resp;
                })
            },

            changeStatus(value) {
                this.getTaskList();
                this.addTasks = value;
            },
            getTaskList() {
                this.$api.taskList({params: {project: this.$route.params.id}}).then(resp => {
                    this.tasksData = resp
                })
            },
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },
        },
        name: "Tasks",
        mounted() {
            this.getTaskList();
        }
    }
</script>

<style>


</style>
