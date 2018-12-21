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

        <el-main>
            <div v-show="!editTestStepActivate" style="margin-top: 10px; ">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-pagination
                            :page-size="11"
                            v-show="apiData.count !== 0"
                            background
                            @current-change="handlePageChange"
                            :current-page.sync="currentPage"
                            layout="total, prev, pager, next, jumper"
                            :total="apiData.count"
                            style="margin-top: 8px; text-align: center"
                        >
                        </el-pagination>
                    </el-col>
                    <el-col :span="12">
                        <el-input
                            style="width: 540px; text-align: center"
                            placeholder="请输入测试用例集名称"
                            v-model="testName"
                            clearable
                        >
                            <template slot="prepend">信息录入</template>
                            <el-button
                                slot="append"
                                type="success"
                                plain
                                @click="handleClickSave"
                            >Save
                            </el-button>

                            <el-button
                                slot="append"
                                type="primary"
                                plain
                                v-loading="suite_loading"
                                @click="handleClickRun"
                            >Run
                            </el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>

            <div v-show="!editTestStepActivate" style="margin-top: 10px;">
                <el-row :gutter="20">
                    <el-col :span="12">
                            <div
                                v-for="(item,index) in apiData.results"
                                draggable='true'
                                @dragstart="currentAPI = JSON.parse(JSON.stringify(item))"
                                style="cursor: pointer; margin-top: 10px; overflow: auto"
                                :key="index"

                            >
                                <div class="block block_post" v-if="item.method.toUpperCase() === 'POST' ">
                                    <span class="block-method block_method_post block_method_color">POST</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>

                                </div>

                                <div class="block block_get" v-if="item.method.toUpperCase() === 'GET' ">
                                    <span class="block-method block_method_get block_method_color">GET</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                                <div class="block block_put" v-if="item.method.toUpperCase() === 'PUT' ">
                                    <span class="block-method block_method_put block_method_color">PUT</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                                <div class="block block_delete" v-if="item.method.toUpperCase() === 'DELETE' ">
                                    <span class="block-method block_method_delete block_method_color">DELETE</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                                <div class="block block_patch" v-if="item.method.toUpperCase() === 'PATCH' ">
                                    <span class="block-method block_method_patch block_method_color">PATCH</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                                <div class="block block_head" v-if="item.method.toUpperCase() === 'HEAD' ">
                                    <span class="block-method block_method_head block_method_color">HEAD</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                                <div class="block block_options"
                                     v-if="item.method.toUpperCase()=== 'OPTIONS' ">
                                    <span class="block-method block_method_options block_method_color">OPTIONS</span>
                                    <span class="block-method block_url">{{item.url}}</span>
                                    <span class="block-summary-description">{{item.name}}</span>
                                </div>

                            </div>

                    </el-col>
                    <el-col :span="12">
                        <el-dialog
                            v-if="dialogTableVisible"
                            :visible.sync="dialogTableVisible"
                            width="70%"
                        >
                            <report :summary="summary"></report>
                        </el-dialog>

                        <div style="max-height: 600px; overflow: auto"
                             @drop='drop($event)'
                             @dragover='allowDrop($event)'
                        >
                            <div class='test-list' v-loading="loading">
                                <draggable
                                    v-model="testData"
                                    @end="dragEnd"
                                    @start="length = testData.length"
                                    :options="{animation:500}"
                                >
                                    <div
                                        v-for="(test, index) in testData"
                                        :key="index"
                                        class="block block_test"
                                        @mousemove="currentTest = index"
                                    >
                                        <span
                                            class="block-method block_method_test block_method_color">{{test.body.method}}</span>
                                        <input class="block-test-name"
                                               v-model="test.body.name"
                                        />

                                        <el-button
                                            style="position: absolute; right: 84px; top: 8px"
                                            v-show="currentTest === index"
                                            type="info"
                                            icon="el-icon-edit"
                                            circle size="mini"
                                            @click="editTestStepActivate = true"
                                        >
                                        </el-button>

                                        <el-button
                                            style="position: absolute; right: 48px; top: 8px"
                                            v-show="currentTest === index"
                                            type="success"
                                            icon="el-icon-caret-right"
                                            circle size="mini"
                                            @click="handleSingleRun"
                                        >
                                        </el-button>

                                        <el-button
                                            style="position: absolute; right: 12px; top: 8px"
                                            v-show="currentTest === index"
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="testData.splice(index, 1)"
                                        >
                                        </el-button>
                                    </div>
                                </draggable>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <http-runner
                v-if="editTestStepActivate"
                :response="testData[currentTest]"
                :config="config"
                v-on:escEdit="editTestStepActivate = false"
                v-on:getNewBody="handleNewBody"
            >
            </http-runner>
        </el-main>

    </el-container>


</template>

<script>
    import draggable from 'vuedraggable'
    import HttpRunner from './TestBody'
    import Report from '../../../reports/DebugReport'

    export default {
        components: {
            draggable,
            HttpRunner,
            Report
        },
        props: {
            config: {
                require: true
            },
            project: {
                require: true
            },
            node: {
                require: true
            },
            testStepResp: {
                require: false
            },
            back: Boolean
        },

        name: "EditTest",
        watch: {
            back() {
                this.editTestStepActivate = false;
            },

            filterText(val) {
                this.$refs.tree2.filter(val);
            },
            testStepResp() {
                if (this.testStepResp.length !== 0) {
                    this.testName = this.testStepResp[0].case.name;
                    this.testId = this.testStepResp[0].case.id;
                } else {
                    this.testName = '';
                    this.testId = '';
                }

                this.testData = JSON.parse(JSON.stringify(this.testStepResp))
            }
        },

        data() {
            return {
                suite_loading: false,
                loading: false,
                dialogTableVisible: false,
                editTestStepActivate: false,
                currentPage: 1,
                length: 0,
                testId: '',
                testName: '',
                currentTest: '',
                currentNode: '',
                currentAPI: '',
                data: '',
                filterText: '',
                expand: '&#xe65f;',
                dataTree: [],
                summary: {},
                apiData: {
                    count: 0,
                    results: []
                },

                testData: []
            }
        },
        methods: {
            handleNewBody(body, newBody) {
                this.editTestStepActivate = false;
                const step = this.testData[this.currentTest].case;
                const id = this.testData[this.currentTest].id;
                this.testData[this.currentTest] = {
                    body: body,
                    newBody: newBody,
                    case: step,
                    id: id
                };
            },

            validateData() {
                if (this.testName === '' || this.testName.length > 50) {
                    this.$notify.warning({
                        title: '提示',
                        duration: 1000,
                        message: '用例集名称必填，不能超过50个字符'
                    });
                    return false
                }

                if (this.testData.length === 0) {
                    this.$notify.warning({
                        title: '提示',
                        duration: 1000,
                        message: '测试用例集至少包含一个接口'
                    });
                    return false
                }

                return true;
            },

            addTestSuite() {
                this.$api.addTestCase({
                    length: this.testData.length,
                    project: this.project,
                    relation: this.node,
                    name: this.testName,
                    body: this.testData
                }).then(resp => {
                    if (resp.success) {
                        this.$message({
                            message: '用例集添加成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$emit("addSuccess");
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            duration: 1000
                        });
                    }
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            updateTestSuite() {
                this.$api.updateTestCase(this.testId, {
                    length: this.testData.length,
                    name: this.testName,
                    body: this.testData
                }).then(resp => {
                    if (resp.success) {
                        this.$message({
                            message: '用例集更新成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$emit("addSuccess");
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            duration: 1000
                        });
                    }
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            handleClickSave() {
                if (this.validateData()) {
                    if (this.testId === '') {
                        this.addTestSuite();
                    } else {
                        this.updateTestSuite();
                    }
                }
            },

            handleClickRun() {
                if (this.validateData()) {
                    this.suite_loading = true;
                    this.$api.runSingleTestSuite({
                        name: this.testName,
                        body: this.testData,
                        config: this.config,
                        project: this.project
                    }).then(resp => {
                        this.suite_loading = false;
                        this.summary = resp;
                        this.dialogTableVisible = true;
                    }).catch(resp => {
                        this.suite_loading = false;
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                }
            },

            handleSingleRun() {
                this.loading = true;
                this.$api.runSingleTest({
                    body: this.testData[this.currentTest],
                    config: this.config,
                    project: this.project
                }).then(resp => {
                    this.loading = false;
                    this.summary = resp;
                    this.dialogTableVisible = true;
                }).catch(resp => {
                    this.loading = false;
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            handlePageChange(val) {
                this.$api.getPaginationBypage({
                    params: {
                        page: this.currentPage,
                        node: this.currentNode.id,
                        project: this.project
                    }
                }).then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            getAPIList() {
                this.$api.apiList({
                    params: {
                        node: this.currentNode.id,
                        project: this.project
                    }
                }).then(res => {
                    this.apiData = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            getTree() {
                this.$api.getTree(this.$route.params.id, {
                    params: {
                        type: 1
                    }
                }).then(resp => {
                    this.dataTree = resp['tree'];
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
                this.getAPIList();

            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            dragEnd(event) {
                if (this.testData.length > this.length) {
                    this.testData.splice(this.length, 1)
                }
            },

            drop(event) {
                event.preventDefault();
                this.testData.push(this.currentAPI);
            },
            allowDrop(event) {
                event.preventDefault();
            },

        },
        mounted() {
            this.getTree();
        }
    }
</script>

<style>

    .test-list {
        height: 590px;
    }

    .block_test {
        margin-top: 10px;
        border: 1px solid #49cc90;
        background-color: rgba(236, 248, 238, .4)
    }

    .block_method_test {
        background-color: #909399;
    }

    .block-test-name {
        width: 350px;
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
