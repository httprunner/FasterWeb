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
            <div v-show="!editTestStepActivate">
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
                            style="margin-top: 5px; text-align: center"
                        >
                        </el-pagination>
                    </el-col>
                    <el-col :span="12">
                        <el-input
                            style="width: 540px; text-align: center"
                            placeholder="请输入测试用例名称"
                            v-model="testName"
                            clearable
                            v-if="testData.length > 0"
                        >
                            <el-select v-model="testTag" slot="prepend" placeholder="请选择" style="width: 105px">

                                <el-option
                                    v-for="value in tagOptions" :key="value"
                                    :label="value"
                                    :value="value"
                                ></el-option>

                            </el-select>

                            <el-button
                                slot="append"
                                type="success"
                                plain
                                @click="handleClickSave"
                            >Save
                            </el-button>

                        </el-input>

                        <el-button
                            type="primary"
                            v-loading="suite_loading"
                            @click="handleClickRun"
                        >Send
                        </el-button>
                    </el-col>
                </el-row>
            </div>

            <div v-show="!editTestStepActivate" style="margin-top: 10px; ">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div
                            v-for="(item,index) in apiData.results"
                            draggable='true'
                            @dragstart="currentAPI = JSON.parse(JSON.stringify(item))"
                            style="cursor: pointer; margin-top: 10px; overflow: auto;"
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
                            <div class='test-list'>
                                <span
                                    v-if="testData.length ===0"
                                    style="color: red">温馨提示：<br/>选择左侧相应API节点显示可拖拽的API<br/>从左边拖拽API至此区域组成业务用例<br/>
                                    上下拖动此区域接口调整接口调用顺序
                                </span>
                                <div
                                    v-if="isConfigExist"
                                    class="block block_test"
                                    @mousemove="currentTest = -1"
                                >
                                    <span class="block-method block_method_config block_method_color">{{testData[0].body.method}}</span>
                                    <input class="block-test-name" v-model="testData[0].body.name" disabled/>

                                    <el-button
                                        style="position: absolute; right: 12px; top: 8px"
                                        v-show="currentTest === -1"
                                        type="danger"
                                        icon="el-icon-delete"
                                        circle size="mini"
                                        @click="testData.splice(index, 1)"
                                    >
                                    </el-button>
                                </div>
                                <draggable
                                    v-model="testData"
                                    @end="dragEnd"
                                    @start="length = testData.length"
                                    :options="{animation:200}"
                                >
                                    <div
                                        v-for="(test, index) in testData"
                                        :key="index"
                                        class="block block_test"
                                        @mousemove="currentTest = index"
                                        v-if="test.body.method !== 'config'"
                                    >
                                        <span
                                            class="block-method block_method_test block_method_color">A P I</span>
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
                :host="host"
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
        computed: {
            isConfigExist: {
                get() {
                    if (this.testData.length > 0 && this.testData[0].body.method === "config" && this.testData[0].body.name !== '请选择') {
                        return true;
                    }
                    return false;
                }
            }
        },
        props: {
            host: {
                require: true
            },
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
            config() {

                const temp = {body: {name: this.config, method: 'config'}};
                if ((this.testData.length === 0 || this.testData[0].body.method !== 'config') && this.config !== '请选择') {
                    this.testData.splice(0, 0, temp)
                } else {
                    if (this.config !== '请选择') {
                        this.testData.splice(0, 1, temp)
                    }

                }

            },
            back() {
                this.editTestStepActivate = false;
            },

            filterText(val) {
                this.$refs.tree2.filter(val);
            },
            testStepResp() {

                try {
                    this.testName = this.testStepResp.case.name;
                    this.testId = this.testStepResp.case.id;
                    this.testTag = this.testStepResp.case.tag;
                    this.relation = this.testStepResp.case.relation;
                    this.testData = JSON.parse(JSON.stringify(this.testStepResp.step))
                } catch (e) {
                    this.testName = '';
                    this.testId = '';
                    this.testTag = '集成用例';
                    this.testData = JSON.parse(JSON.stringify(this.testStepResp))
                }
            }
        },

        data() {
            return {
                tagOptions: {
                    1: '冒烟用例',
                    2: '集成用例',
                    3: '监控脚本'
                },
                suite_loading: false,
                loading: false,
                dialogTableVisible: false,
                editTestStepActivate: false,
                currentPage: 1,
                length: 0,
                testId: '',
                testName: '',
                relation: '',
                testTag: '集成用例',
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
                if (this.testName === '' || this.testName.length > 100) {
                    this.$notify.warning({
                        title: '提示',
                        duration: 1000,
                        message: '用例集名称必填，不能超过100个字符'
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

                if (this.testData[0].body.method === "config" && this.testData.length === 1) {
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
                var length = this.testData.length;

                if (this.testData[0].body.method === "config") {
                    length -= 1;
                }
                this.$api.addTestCase({
                    length: length,
                    project: this.project,
                    relation: this.node,
                    name: this.testName,
                    body: this.testData,
                    tag: this.testTag
                }).then(resp => {
                    if (resp.success) {
                        this.$emit("addSuccess");
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            duration: 1000
                        });
                    }
                })
            },

            updateTestSuite() {
                var length = this.testData.length;
                if (this.testData[0].body.method === "config") {
                    length -= 1;
                }
                this.$api.updateTestCase(this.testId, {
                    length: length,
                    name: this.testName,
                    tag: this.testTag,
                    body: this.testData,
                    project: this.project,
                    relation: this.relation
                }).then(resp => {
                    if (resp.success) {
                        this.$emit("addSuccess");
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            duration: 1000
                        });
                    }
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
                        host: this.host,
                        name: this.testName,
                        body: this.testData,
                        project: this.project
                    }).then(resp => {
                        this.suite_loading = false;
                        this.summary = resp;
                        this.dialogTableVisible = true;
                    }).catch(resp => {
                        this.suite_loading = false;
                    })
                }
            },

            handleSingleRun() {
                this.loading = true;
                var config = null;
                if (this.testData.length > 0 && this.testData[0].body.method === "config") {
                    config = this.testData[0].body;
                }
                this.$api.runSingleTest({
                    host: this.host,
                    config: config,
                    body: this.testData[this.currentTest],
                    project: this.project
                }).then(resp => {
                    this.loading = false;
                    this.summary = resp;
                    this.dialogTableVisible = true;
                }).catch(resp => {
                    this.loading = false;
                })
            },

            handlePageChange(val) {
                this.$api.getPaginationBypage({
                    params: {
                        page: this.currentPage,
                        node: this.currentNode,
                        project: this.project,
                        search: ''
                    }
                }).then(res => {
                    this.apiData = res;
                })
            },

            getAPIList() {
                this.$api.apiList({
                    params: {
                        node: this.currentNode,
                        project: this.project,
                        search: ''
                    }
                }).then(res => {
                    this.apiData = res;
                })
            },

            getTree() {
                this.$api.getTree(this.$route.params.id, {
                    params: {
                        type: 1
                    }
                }).then(resp => {
                    this.dataTree = resp['tree'];
                })
            },

            handleNodeClick(node, data) {
                this.currentNode = node.id;
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
            this.getAPIList();
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
        background-color: darkcyan;
    }

    .block_method_config {
        background-color: red;
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
