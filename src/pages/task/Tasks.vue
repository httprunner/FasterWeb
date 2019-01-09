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
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                    ></el-button>

                    <el-button
                        :disabled="!addTasks"
                        type="text"
                        style="position: absolute; right: 30px;"
                    >返回列表
                    </el-button>
                    还在开发中！！！

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
                <div style="position: fixed; bottom: 0; right:0; left: 220px; top: 150px">
                    <el-table
                        v-if="!addTasks"
                        :data="tasksData.results"
                        :show-header="tasksData.results.length !== 0 "
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
                            label="任务名称"
                            width="250"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>


                        <el-table-column
                            width="200"
                            label="时间配置"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.time}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="邮件策略"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.sene_type}}</div>

                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="用例个数"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.length}}</div>
                            </template>
                        </el-table-column>


                        <el-table-column
                            width="80"
                            label="状态"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.status}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="320"
                            label="接收人"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.receiver}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="300"
                            label="抄送人"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.copy}}</div>
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
            >
            </add-tasks>
        </el-container>
    </el-container>

</template>

<script>
    import AddTasks from './AddTasks'
    export default {
        components:{
            AddTasks
        },
        data() {
            return {
                addTasks: false,
                currentPage: 1,
                currentRow: '',
                tasksData: {
                    count: 1,
                    results: [
                        {
                            name: 'tasks name',
                            send_type: '始终发送',
                            status: true,
                            length: 2,
                            time: '11',
                            receiver: '1263374981@qq.com',
                            copy: 'copy@lexinfintech.com'

                        }
                    ]
                },
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },
        },
        name: "Tasks",
        mounted() {

        }
    }
</script>

<style>


</style>
