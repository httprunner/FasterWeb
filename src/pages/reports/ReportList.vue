<template>
    <el-container>
        <el-header style="padding: 0; height: 50px; margin-top: 10px">
            <div style="padding-top: 8px; padding-left: 30px;">

                <el-row>
                    <el-col :span="6" v-if="reportData.count > 11">
                        <el-input placeholder="请输入报告名称" clearable v-model="search">
                            <el-button slot="append" icon="el-icon-search" @click="getReportList"></el-button>
                        </el-input>
                    </el-col>

                    <el-col :span="1">
                        <el-button
                            v-show="reportData.count !== 0"
                            style="margin-left: 20px"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="delSelectionReports"
                        ></el-button>
                    </el-col>

                    <el-col :span="7">
                        <el-pagination
                            :page-size="11"
                            v-show="reportData.count !== 0 "
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            layout="total, prev, pager, next, jumper"
                            :total="reportData.count"
                        >
                        </el-pagination>
                    </el-col>


                </el-row>

            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px;">
                <div style="position: fixed; bottom: 0; right:0; left: 220px; top: 120px">
                    <el-table
                        highlight-current-row
                        :data="reportData.results"
                        :show-header="reportData.results.length !== 0 "
                        stripe
                        height="calc(100%)"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        >
                        </el-table-column>

                        <el-table-column
                            label="报告类型"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-tag color="#2C3E50" style="color: white">{{ scope.row.type }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="报告名称"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="通过状态"
                        >
                            <template slot-scope="scope">
                                <div
                                    :class="{'pass': scope.row.success, 'fail':!scope.row.success}"
                                    v-text="scope.row.success === true ? 'Pass' :'Fail'"
                                ></div>
                            </template>
                        </el-table-column>


                        <el-table-column
                            label="测试时间"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.time.start_at|timestampToTime}}</div>

                            </template>
                        </el-table-column>

                        <el-table-column
                            label="持续时间"
                        >
                            <template slot-scope="scope">
                                <div v-text="scope.row.time.duration.toFixed(3)+' 秒'"></div>

                            </template>
                        </el-table-column>

                        <el-table-column
                            width="80"
                            label="总计接口"
                        >
                            <template slot-scope="scope">
                                <el-tag>{{ scope.row.stat.testsRun }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="80"
                            label="通过个数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="success"> {{ scope.row.stat.successes }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="80"
                            label="失败个数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="danger">{{ scope.row.stat.failures }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="80"
                            label="异常个数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="warning">{{ scope.row.stat.errors }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="80"
                            label="跳过个数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="info">{{ scope.row.stat.skipped }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="系统信息"
                        >
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>HttpRunner: {{ scope.row.platform.httprunner_version }}</p>
                                    <p>Platform: {{ scope.row.platform.platform }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.platform.python_version }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>


                        <el-table-column>
                            <template slot-scope="scope">
                                <el-row v-show="currentRow === scope.row">
                                    <el-button
                                        type="info"
                                        icon="el-icon-view"
                                        circle size="mini"
                                        @click="handleWatchReports(scope.row.id)"
                                    >
                                    </el-button>

                                    <el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        circle size="mini"
                                        @click="handleDelReports(scope.row.id)"
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


        data() {
            return {
                search: '',
                selectReports: [],
                currentRow: '',
                currentPage: 1,
                reportData: {
                    count: 0,
                    results: []
                }
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleWatchReports(index) {
                window.open(this.$api.baseUrl + "/api/fastrunner/reports/" + index + "/")

            },


            handleSelectionChange(val) {
                this.selectReports = val;
            },


            handleCurrentChange(val) {
                this.$api.getReportsPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.reportData = resp;
                })
            },

            handleDelReports(index) {
                this.$confirm('此操作将永久删除该测试报告，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteReports(index).then(resp => {
                        if (resp.success) {
                            this.getReportList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },

            delSelectionReports() {
                if (this.selectReports.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的测试报告，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllReports({data: this.selectReports}).then(resp => {
                            this.getReportList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少勾选一个测试报告',
                        duration: 1000
                    })
                }
            },
            getReportList() {
                this.$api.reportList({
                    params: {
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.reportData = resp;
                })
            },
        },
        name: "ReportList",
        mounted() {
            this.getReportList();
        }
    }
</script>

<style scoped>
    .pass {
        font-weight: bold;
        color: #13ce66;
    }
    .fail {
        font-weight: bold;
        color: red;
    }


</style>
