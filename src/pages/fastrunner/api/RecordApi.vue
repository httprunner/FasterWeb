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
                        新建分组
                    </el-button>

                    <el-dialog
                        title="新建分组"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form
                            :model="nodeForm"
                            :rules="rules"
                            ref="nodeForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="节点名称" prop="name">
                                <el-input v-model="nodeForm.name"></el-input>
                            </el-form-item>
                        </el-form>

                        <el-radio-group v-model="radio" size="small">
                            <el-radio-button label="根节点"></el-radio-button>
                            <el-radio-button label="子节点"></el-radio-button>
                        </el-radio-group>

                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('nodeForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                    <el-button
                        :disabled="currentNode === '' "
                        type="danger"
                        size="small"
                        icon="el-icon-delete"
                        @click="deleteNode"
                    >删除分组
                    </el-button>

                    <el-button
                        :disabled="currentNode === '' "
                        type="warning"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="addAPIFlag = true"
                    >添加接口
                    </el-button>

                    <el-button
                        type="primary"
                        plain
                        size="small"
                        icon="el-icon-upload"
                        :disabled="currentNode === '' "
                    >导入接口
                    </el-button>
                    <el-button
                        type="info"
                        plain
                        size="small"
                        icon="el-icon-download"
                        :disabled="currentNode === '' "
                    >导出接口
                    </el-button>

                    <el-checkbox
                        v-model="checked"
                        style="margin-left: 40px;"
                        :disabled="currentNode === ''"
                    >全选
                    </el-checkbox>

                    <el-button
                        type="warning"
                        icon="el-icon-star-off"
                        circle
                        size="mini"
                        style="margin-left: 20px"
                        :disabled="currentNode === ''"
                    ></el-button>

                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        :disabled="currentNode === ''"
                        @click="del = !del"
                    ></el-button>


                    <el-tooltip class="item" effect="dark" content="环境信息" placement="top-start">
                        <el-button plain size="small" icon="el-icon-view"></el-button>
                    </el-tooltip>

                    <el-select
                        placeholder="请选择"
                        size="small"
                        tyle="margin-left: -6px"
                        :disabled="dataTree.length === 0"
                        v-model="currentConfig"
                    >
                        <el-option
                            v-for="item in configOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-aside style="width: 260px; margin-top: 10px; overflow: auto">
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

            <el-main style="padding: 0; ">
                <api-body
                    v-show="addAPIFlag"
                    :nodeId="currentNode.id"
                    :project="$route.params.id"
                    :response="response"
                >
                </api-body>

                <api-list
                    :checked="checked"
                    v-show="!addAPIFlag"
                    v-on:api="handleAPI"
                    :node="currentNode !== '' ? currentNode.id : '' "
                    :project="$route.params.id"
                    :del="del"
                >
                </api-list>

            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import ApiBody from '../../httprunner/Body'
    import ApiList from './components/ApiList'

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        components: {
            ApiBody,
            ApiList
        },
        data() {
            return {
                checked:false,
                del: false,
                response: '',
                nodeForm: {
                    name: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入节点名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ]
                },
                radio: '根节点',
                addAPIFlag: false,
                currentConfig: '',
                treeId: '',
                maxId: '',
                dialogVisible: false,
                currentNode: '',
                data: '',
                filterText: '',
                expand: '&#xe667;',
                dataTree: [],
                configOptions: [{
                    value: '测试环境',
                    label: '测试环境'
                }]
            }
        },
        methods: {
            handleAPI(response) {
                this.addAPIFlag = true;
                this.response = response;
            },

            getTree() {
                this.$api.getTree(this.$route.params.id, {params: {type: 1}}).then(resp => {
                    this.dataTree = resp['tree'];
                    this.treeId = resp['id'];
                    this.maxId = resp['max'];
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            updateTree(mode) {
                this.$api.updateTree(this.treeId, {
                    body: this.dataTree,
                    node: this.currentNode.id,
                    mode: mode,
                    type: 1
                }).then(resp => {
                    if (resp['success']) {
                        this.$message.success(resp['msg']);
                        this.dataTree = resp['tree'];
                        this.maxId = resp['max'];
                    } else {
                        this.$message.error(resp['msg']);
                    }
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            deleteNode() {
                this.$confirm('此操作将永久删除该节点下所有接口, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.currentNode === '') {
                        this.$message.info('请选择一个节点');
                    } else {
                        if (this.currentNode.children.length !== 0) {
                            this.$message.warning('此节点有子节点，不可删除！');
                        } else {
                            this.remove(this.currentNode, this.data);
                            this.updateTree(true);
                        }
                    }

                })
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.append(this.currentNode);
                        this.updateTree(false);
                        this.dialogVisible = false;
                    }
                });
            },

            handleNodeClick(node, data) {
                this.addAPIFlag = false;
                this.currentNode = node;
                this.data = data;
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            remove(node, data) {
                const parent = data.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },

            append(data) {
                const newChild = {id: ++this.maxId, label: this.nodeForm.name, children: []};
                if (data === '' || this.dataTree.length === 0 || this.radio === '根节点') {
                    this.dataTree.push(newChild);
                    return
                }
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            }

        },
        name: "RecordApi",
        mounted() {
            this.getTree();
        }
    }
</script>

<style>



</style>
