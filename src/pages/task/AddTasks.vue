<template>
    <el-container>
        <el-aside style="margin-top: 10px;">
            <div class="nav-api-side">
                <div class="api-tree">
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText"
                        size="medium"
                        clearable
                        prefix-icon="el-icon-search"
                    >
                    </el-input>

                    <el-tree
                        @node-click="handleNodeClick"
                        :data="dataTree"
                        node-key="id"
                        :default-expand-all="false"
                        :expand-on-click-node="false"
                        highlight-current
                        :filter-node-method="filterNode"
                        ref="tree2"
                    >
                            <span class="custom-tree-node"
                                  slot-scope="{ node, data }"
                            >
                                <span><i class="iconfont" v-html="expand"></i>&nbsp;&nbsp;{{ node.label }}</span>
                            </span>
                    </el-tree>
                </div>

            </div>

        </el-aside>

        <el-main style="padding-top: 0">
            <div style="margin-top: 10px;">
                <el-row :gutter="40">
                    <el-col :span="10">
                        <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="80px"
                        >
                            <el-form-item label="任务名称" prop="name">
                                <el-input v-model="ruleForm.name" ></el-input>
                            </el-form-item>
                            <el-form-item label="运行环境" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="时间配置" required>
                                <el-col :span="11">
                                    <el-form-item prop="date1">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="11">
                                    <el-form-item prop="date2">
                                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2"
                                                        style="width: 100%;"></el-time-picker>
                                    </el-form-item>
                                </el-col>

                            </el-form-item>
                            <el-form-item label="任务状态" prop="delivery">
                                <el-switch v-model="ruleForm.delivery"></el-switch>
                            </el-form-item>

                            <el-form-item label="邮件策略" prop="resource">
                                <el-radio-group v-model="ruleForm.resource">
                                    <el-radio label="始终发送"></el-radio>
                                    <el-radio label="仅失败发送"></el-radio>
                                    <el-radio label="从不发送"></el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="邮件接收人列表" prop="desc">
                                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                            </el-form-item>

                            <el-form-item label="邮件抄送人列表" prop="desc">
                                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>
                        </el-form>

                    </el-col>
                    <el-col :span="14">
                        <div style="max-height: 700px; overflow: auto"
                        >
                            <el-pagination
                                :page-size="11"
                                v-show="suiteData.count !== 0"
                                background
                                @current-change="handlePageChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="suiteData.count"
                                style="text-align: center"
                            >
                            </el-pagination>
                            <div class='test-list'>
                                <div
                                    v-for="(test, index) in suiteData.results"
                                    :key="index"
                                    class="block block_test"
                                >
                                        <span
                                            class="block-method block_method_test block_method_color">Suite</span>
                                    <input class="block-test-name"
                                           v-model="test.name"
                                    />
                                </div>
                            </div>

                        </div>

                    </el-col>

                </el-row>
            </div>


        </el-main>

    </el-container>


</template>

<script>

    export default {

        name: "AddTasks",
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            },
        },

        data() {
            return {
                currentNode: '',
                currentPage: 1,
                filterText: '',
                expand: '&#xe65f;',
                dataTree: [],
                suiteData: {
                    count: 0,
                    results: []
                },
                ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: true,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    date1: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    date2: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    type: [
                        { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ],
                    resource: [
                        { required: true, message: '请选择活动资源', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写活动形式', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getTree() {
                this.$api.getTree(this.$route.params.id, {params: {type: 2}}).then(resp => {
                    this.dataTree = resp.tree;
                })
            },

            handleNodeClick(node, data) {
                this.currentNode = node;
                this.data = data;
                this.getTestList();

            },

            getTestList() {
                this.$api.testList({
                    params: {
                        project: this.$route.params.id,
                        node: this.currentNode.id
                    }
                }).then(resp => {
                    this.suiteData = resp;
                })
            },
        },
        mounted() {
            this.getTree();
        }
    }
</script>

<style scoped>

    .test-list {
        height: 590px;
    }

    .block_test {
        margin-top: 10px;
        border: 1px solid #49cc90;
        background-color: rgba(236, 248, 238, .4)
    }

    .block_method_test {
        background-color: #304056;
    }

    .block-test-name {
        width: 700px;
        padding-left: 10px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        font-family: Open Sans, sans-serif;
        color: #3b4151;
        border: none;
        outline: none;
        background: rgba(236, 248, 238, .4)

    }


</style>
