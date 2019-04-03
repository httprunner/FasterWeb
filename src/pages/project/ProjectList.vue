<template>
    <el-container>
        <el-header style="background: #F7F7F7; padding: 0; height: 50px">
            <div>
                <div style="padding-top: 10px; margin-left: 10px;">
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-circle-plus"
                               @click="dialogVisible = true">
                        添加项目
                    </el-button>

                    <el-button style="margin-left: 50px"
                               type="info"
                               round
                               size="small"
                               icon="el-icon-d-arrow-left"
                               :disabled="projectData.previous === null "
                               @click="getPagination(projectData.previous)"
                    >
                        上一页
                    </el-button>

                    <el-button type="info"
                               round
                               size="small"
                               :disabled="projectData.next === null"
                               @click="getPagination(projectData.next)"
                    >
                        下一页
                        <i class="el-icon-d-arrow-right"></i>
                    </el-button>


                    <el-dialog
                        title="添加项目"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form :model="projectForm"
                                 :rules="rules"
                                 ref="projectForm"
                                 label-width="100px"
                                 class="project">
                            <el-form-item label="项目名称" prop="name">
                                <el-input v-model="projectForm.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="项目描述" prop="desc">
                                <el-input v-model="projectForm.desc" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
                    </el-dialog>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <el-table
                    highlight-current-row
                    :data="projectData.results"
                    border
                    stripe
                    :show-header="projectData.results.length > 0"
                    highlight-current-row
                    style="width: 100%;"
                >
                    <el-table-column
                        label="项目名称"
                        width="250"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span
                                style="font-size: 18px; font-weight: bold; cursor: pointer;"
                                @click="handleCellClick(scope.row)"
                            >{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="负责人"
                        width="200"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.responsible }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="项目描述"
                        width="300"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.desc }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="更新时间"
                        width="260"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.update_time | datetimeFormat }}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                        label="操作"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="medium"
                                @click="handleCellClick(scope.row)">详情
                            </el-button>

                            <el-button
                                size="medium"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>

                            <el-dialog
                                title="编辑项目"
                                :visible.sync="editVisible"
                                width="30%"
                            >
                                <el-form :model="projectForm"
                                         :rules="rules"
                                         ref="projectForm"
                                         label-width="100px"
                                         class="project">
                                    <el-form-item label="项目名称" prop="name">
                                        <el-input v-model="projectForm.name" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目描述" prop="desc">
                                        <el-input v-model="projectForm.desc" clearable></el-input>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
                            </el-dialog>
                            <el-button
                                size="medium"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
    </el-container>


</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                editVisible: false,
                projectData: {
                    results: []
                },
                projectForm: {
                    name: '',
                    desc: '',
                    responsible: this.$store.state.user,
                    id: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ],
                    desc: [
                        {required: true, message: '简要描述下该项目', trigger: 'blur'},
                        {min: 1, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleCellClick(row) {
                this.$store.commit('setRouterName', 'ProjectDetail');
                this.setLocalValue("routerName",'ProjectDetail');
                this.$router.push({name: 'ProjectDetail', params: {id: row['id']}});
            },
            handleEdit(index, row) {
                this.editVisible = true;
                this.projectForm.name = row['name'];
                this.projectForm.desc = row['desc'];
                this.projectForm.id = row['id'];
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deleteProject({data: {"id": row["id"]}}).then(resp => {
                        if (resp['success']) {
                            this.success(resp);
                            this.getProjectList();
                        } else {
                            this.failure(resp);
                        }
                    })
                })
            },
            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.editVisible = false;
                        let obj;

                        if (this.projectForm.id === '') {
                            obj = this.$api.addProject(this.projectForm);
                        } else {
                            obj = this.$api.updateProject(this.projectForm);
                        }
                        obj.then(resp => {
                            if (resp.success) {
                                this.success(resp);
                                this.getProjectList();
                            } else {
                                this.failure(resp);
                            }

                            this.projectForm.name = '';
                            this.projectForm.desc = '';
                            this.projectForm.id = '';
                        })
                    } else {
                        if (this.projectForm.id !== '') {
                            this.editVisible = true;
                        } else {
                            this.dialogVisible = true;
                        }
                        return false;
                    }
                });

            },
            success(resp) {
                this.$notify({
                    message: resp["msg"],
                    type: 'success',
                    duration: 1000
                });
            },
            failure(resp) {
                this.$notify.error({
                    message: resp["msg"],
                    duration: 1000
                });
            },
            getProjectList() {
                this.$api.getProjectList().then(resp => {
                    this.projectData = resp;
                })
            },
            getPagination(url) {
                this.$api.getPagination(url).then(resp => {
                    this.projectData = resp;
                })
            },
        },
        mounted() {
            this.getProjectList();
        },
        name: "ProjectList"
    }
</script>

<style scoped>

</style>
