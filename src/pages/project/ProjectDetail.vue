<template>

    <div>
        <el-dialog
            title="编辑项目"
            :visible.sync="dialogVisible"
            width="30%"
            align="center"
        >
            <el-form
                :model="projectForm"
                :rules="rules"
                ref="projectForm"
                label-width="100px"
            >
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="projectForm.name"></el-input>
                </el-form-item>

                <el-form-item label="项目描述" prop="desc">
                    <el-input v-model="projectForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
        </el-dialog>
        <ul class="title-project">
            <li class="title-li" title="Test API Project">
                <b>{{projectInfo.name}}</b>
                <b class="desc-li">{{projectInfo.desc}}</b>
                <a @click="dialogVisible = true" style="cursor: pointer">
                    <i class="iconfont">&#xe67d;</i>修改
                </a>

            </li>
        </ul>

        <ul class="project_detail">
            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe74a;</i> &nbsp;{{projectInfo.api_count}} 个API</p>
                <p class="desc-p">接口总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe6da;</i> &nbsp;{{projectInfo.case_count}} 个用例集</p>
                <p class="desc-p">用例集总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xee32;</i> &nbsp;{{projectInfo.config_count}} 套环境</p>
                <p class="desc-p">环境套数</p>
            </li>
        </ul>

        <ul class="project_detail">
            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe61e;</i> &nbsp;0 项task</p>
                <p class="desc-p">定时任务</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe66e;</i> &nbsp;0 个报告</p>
                <p class="desc-p">测试报告</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe63b;</i> &nbsp;{{projectInfo.update_time | datetimeFormat}}</p>
                <p class="desc-p">最后更新时间</p>
            </li>
        </ul>


    </div>
</template>

<script>
    export default {
        name: "ProjectDetail",
        data() {
            return {
                dialogVisible: false,
                projectInfo: {},
                projectForm: {
                    name: '',
                    desc: '',
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

            getProjectDetail() {
                const pk = this.$route.params.id;
                this.$api.getProjectDetail(pk).then(res => {
                    this.projectInfo = res;
                    this.projectForm.name = res['name'];
                    this.projectForm.desc = res['desc'];
                    this.projectForm.id = pk;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.$api.updateProject(this.projectForm).then(resp => {
                            if (resp["success"]) {
                                this.success(resp);
                                this.getProjectDetail();
                            } else {
                                this.failure(resp);
                            }

                            this.projectForm.name = this.projectInfo['name'];
                            this.projectForm.desc = this.projectInfo['desc'];
                        }).catch(resp => {
                            this.$message.error({
                                message: '服务器连接超时，请重试',
                                duration: 1000
                            })
                        });
                    } else {
                        this.dialogVisible = true;
                        return false;
                    }
                });
            },
        },
        mounted() {
            this.getProjectDetail();
        }
    }
</script>

<style scoped>


    .desc-p {
        padding-top: 10px;
        font-size: 12px;
        color: #b6b6b6;
    }

    .title-p {
        font-size: 18px;
        margin-top: 10px;
    }

    .title-project li a {
        font-size: 12px;
        text-decoration: none;
        color: #a3a3a3;
        margin-left: 20px;

    }

    .pull-left {
        float: left;
        margin-left: 10px;
    }

    .project_detail li {
        margin-top: 10px;
        text-indent: 20px;
        display: inline-block;
        height: 90px;
        width: calc(20% - 1.5px);
        border: 1px solid #ddd;
    }

    .project_detail {
        height: 100px;
    }

    .title-project {
        margin-top: 40px;
        margin-left: 10px;
    }

    ul li {
        list-style: none;
    }

    .title-li {
        font-size: 24px;
        color: #607d8b;
    }

    .desc-li {
        margin-top: 10px;
        color: #b6b6b6;
        font-size: 14px;
    }
</style>
