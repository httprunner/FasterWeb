<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="dialogVisible=true"
                    >新增变量
                    </el-button>

                    <el-button
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="delSelectionVariables"
                    ></el-button>

                    <el-dialog
                        title="添加变量"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form
                            :model="variablesForm"
                            :rules="rules"
                            ref="variablesForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="变量名" prop="key">
                                <el-input v-model="variablesForm.key" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="变量值" prop="value">
                                <el-input v-model="variablesForm.value" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('variablesForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                    <el-dialog
                        title="编辑变量"
                        :visible.sync="editdialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form
                            :model="editVariablesForm"
                            :rules="rules"
                            ref="editVariablesForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="变量名" prop="key">
                                <el-input v-model="editVariablesForm.key" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="变量值" prop="value">
                                <el-input v-model="editVariablesForm.value" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="editdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleEditConfirm('editVariablesForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-header style="padding: 0; height: 50px;">
                <div style="padding-top: 8px; padding-left: 30px; overflow: hidden">
                    <el-row :gutter="50">
                        <el-col :span="6">
                            <el-input placeholder="请输入变量名称" v-if="variablesData.count > 11" clearable v-model="search">
                                <el-button slot="append" icon="el-icon-search" @click="getVariablesList"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="7">
                            <el-pagination
                                :page-size="11"
                                v-show="variablesData.count !== 0 "
                                background
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="variablesData.count"
                            >
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </el-header>

            <el-container>
                <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                    <div style="position: fixed; bottom: 0; right:0; left: 220px; top: 150px">
                        <el-table
                            :data="variablesData.results"
                            :show-header="variablesData.results.length !== 0 "
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
                                label="变量名"
                                width="350"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.key}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                width="450"
                                label="变量值"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.value}}</div>

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
                                width="250"
                            >
                                <template slot-scope="scope">
                                    <el-row v-show="currentRow === scope.row">
                                        <el-button
                                            type="info"
                                            icon="el-icon-edit"
                                            circle size="mini"
                                            @click="handleEditVariables(scope.row)"
                                        ></el-button>


                                        <el-button
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="handleDelVariables(scope.row.id)"
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
    </el-container>

</template>

<script>

    export default {


        data() {
            return {
                search: '',
                selectVariables: [],
                currentRow: '',
                currentPage: 1,
                variablesData: {
                    count: 0,
                    results: []
                },
                editdialogVisible: false,
                dialogVisible: false,
                variablesForm: {
                    key: '',
                    value: '',
                    project: this.$route.params.id
                },

                editVariablesForm: {
                    key: '',
                    value: '',
                    id: ''
                },

                rules: {
                    key: [
                        {required: true, message: '请输入变量名', trigger: 'blur'},
                        {min: 1, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: '请输入变量值', trigger: 'blur'},
                        {min: 1, max: 1024, message: '最多不超过1024个字符', trigger: 'blur'}
                    ]
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

            handleEditVariables(row) {
                this.editVariablesForm = {
                    key: row.key,
                    value: row.value,
                    id: row.id
                };

                this.editdialogVisible = true;
            },

            handleDelVariables(index) {
                this.$confirm('此操作将永久删除该全局变量，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteVariables(index).then(resp => {
                        if (resp.success) {
                            this.getVariablesList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            handleSelectionChange(val) {
                this.selectVariables = val;
            },

            handleCurrentChange(val) {
                this.$api.getVariablesPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.variablesForm.project,
                        search: this.search
                    }
                }).then(resp => {
                    this.variablesData = resp;
                })
            },
            delSelectionVariables() {
                if (this.selectVariables.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的全局变量，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllVariabels({data: this.selectVariables}).then(resp => {
                            this.getVariablesList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少勾选一个全局变量',
                        duration: 1000
                    })
                }
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.$api.addVariables(this.variablesForm).then(resp => {
                            if (!resp.success) {
                                this.$message.info({
                                    message: resp.msg,
                                    duration: 1000
                                })
                            } else {
                                this.variablesForm.key = '';
                                this.variablesForm.value = '';
                                this.getVariablesList();
                            }
                        })

                    }
                });

            },

            handleEditConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editdialogVisible = false;
                        this.$api.updateVariables(this.editVariablesForm.id, this.editVariablesForm).then(resp => {
                            if (!resp.success) {
                                this.$message.info({
                                    message: resp.msg,
                                    duration: 1000
                                })
                            } else {
                                this.getVariablesList();
                            }
                        })
                    }
                });

            },

            getVariablesList() {
                this.$api.variablesList({
                    params: {
                        project: this.variablesForm.project,
                        search: this.search
                    }
                }).then(resp => {
                    this.variablesData = resp;
                })
            },
        },
        name: "GlobalEnv",
        mounted() {
            this.getVariablesList();
        }
    }
</script>

<style>


</style>
