<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button
                        type="success"
                        size="small"
                        icon="el-icon-circle-plus"
                        @click="dialogVisible = true"
                    >
                        添加Suite
                    </el-button>


                    <el-dialog
                        title="添加Suite"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form
                            :model="suiteForm"
                            :rules="rules"
                            ref="suiteForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="Suite名称" prop="name">
                                <el-input v-model="suiteForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="简要描述" prop="desc">
                                <el-input v-model="suiteForm.desc"></el-input>
                            </el-form-item>
                        </el-form>

                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('suiteForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                    <el-button
                        type="info"
                        size="small"
                        icon="el-icon-tickets"
                    >Suite列表
                    </el-button>


                    <el-checkbox style="margin-left: 40px;">全选</el-checkbox>
                    <el-button type="warning" icon="el-icon-star-off" circle size="mini"
                               style="margin-left: 20px"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-aside style="width: 260px; margin-top: 10px; overflow: auto" v-if="false">
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

                        <div class="operation-li">
                            <el-tree
                                @node-click="handleNodeClick"
                                :data="dataTree"
                                node-key="id"
                                :default-expand-all="false"
                                :expand-on-click-node="false"
                                draggable
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
                </div>

            </el-aside>

            <el-main style="padding: 0; margin-top: 10px">
                <suite-list></suite-list>

            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import SuiteList from './SuiteList'

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        components: {
            SuiteList
        },
        data() {
            return {
                response: '',
                suiteForm: {
                    name: '',
                    desc: '',
                    project: this.$route.params.id
                },
                rules: {
                    name: [
                        {required: true, message: '请输入Suite名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ],
                    desc: [
                        {required: true, message: '请简要描述下该Suite', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ]
                },
                dialogVisible: false,
                currentNode: '',
                data: '',
                filterText: '',
                expand: '&#xe667;',
                dataTree: [],
            }
        },
        methods: {
            getTree() {
                this.$api.getTree(this.$route.params.id).then(resp => {
                    this.dataTree = resp['tree'];
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            //新增Suite
            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addSuite();
                        this.dialogVisible = false;
                    }
                });
            },

            addSuite() {
                this.$api.addSuite(this.suiteForm).then(resp => {
                    this.$router.go(0);
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            handleNodeClick(node, data) {
                this.currentNode = node;
                this.data = data;
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
        },
        name: "TestSuite",
        mounted() {
            this.getTree();
        }
    }
</script>

<style>

    ul li {
        list-style: none;
    }

    .operation-li {
        line-height: 60px;
        color: #555;
        font-size: 12px;
        width: 240px;
        margin-top: 1px;
    }

    .api-tree {
        padding: 0;
        margin: 0;
    }

    .nav-api-header {
        height: 50px;
        border-bottom: 1px solid #ddd;
        background-color: #F7F7F7;

    }

    .nav-api-side {
        border: 1px solid #ddd;
        width: 240px;
        margin-left: 10px;
        border-radius: 4px;
        height: 630px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .tree {
        overflow-y: auto;
        overflow-x: auto;
        width: 240px;
        height: 500px;
    }

    .el-tree {
        min-width: 100%;
        display: inline-block !important;
    }

    .el-tree-node__expand-icon {
        padding: 4px !important;
    }

    .el-tree-node__content {
        height: 50px;
    }


</style>
