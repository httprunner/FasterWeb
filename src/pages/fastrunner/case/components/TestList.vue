<template>
    <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%"
        max-height="550"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        @selection-change="handleSelectionChange"
    >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            label="用例集名称"
            width="420"
        >
            <template slot-scope="scope">
                <div>{{scope.row.name}}</div>
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
                        @click="handleRowClick(scope.row)"
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

</template>

<script>
    export default {
        name: "TestList",

        props: {
            project: {
                require: true
            },
            node: {
                require: false
            },
            del: Boolean
        },

        watch: {
            node() {
                this.getTestList();
            },

            del() {
                if (this.selectTest.length !== 0) {
                    this.$confirm('此操作将永久删除测试用例集，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllTest({data:this.selectTest}).then(resp => {
                            this.getTestList();
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
                        message: '请至少选择一个用例集',
                        duration:1000
                    })
                }
            }
        },
        data() {
            return {
                selectTest: [],
                currentRow: '',
                tableData: []
            }
        },

        methods: {
            handleCopyTest(id) {
                this.$prompt('请输入用例集名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '用例集不能为空'
                }).then(({ value }) => {
                    this.$api.coptTest(id, {
                        'name': value,
                        'relation': this.node,
                        'project': this.project
                    }).then(resp => {
                        if (resp.success) {
                            this.getTestList();
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

            handleSelectionChange(val) {
                this.selectTest = val;
            },

            handleDelTest(id) {
                this.$confirm('此操作将永久删除该测试用例集，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteTest(id).then(resp => {
                        if (resp.success) {
                            this.getTestList();
                        }else {
                            this.$message.error(resp.msg)
                        }
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                })
            },
            getTestList() {
                this.$api.testList({
                    params: {
                        project: this.project,
                        node: this.node
                    }
                }).then(resp => {
                    this.tableData = resp;
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
