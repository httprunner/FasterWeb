<template>
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
            <div style="margin-top: 10px">
                <el-input
                    style="width: 600px"
                    placeholder="请输入测试用例集名称"
                    v-model="name"
                    clearable
                >
                    <template slot="prepend">用例集信息录入</template>

                    <el-button
                        slot="append"
                        type="success"
                        plain
                        @click="save = !save"
                    >Save
                    </el-button>
                </el-input>
            </div>
            <div style="margin-top: 10px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div v-for="item in apiData.results"
                             draggable='true'
                             @dragstart="currentAPI = item"
                             style="cursor: pointer"
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
                        <div style="max-height: 600px; overflow: auto"
                             @drop='drop($event)'
                             @dragover='allowDrop($event)'
                        >
                            <div class='test-list'>
                                <draggable
                                    v-model="testData"
                                    @end="dragEnd"
                                    @start="length = testData.length"
                                    :options = "{animation:500}"
                                >
                                    <div v-for="(item, index) in testData"
                                         :key="item.id"
                                         class="block block_test"
                                         @mousemove="currentTest = index"
                                    >
                                        <span class="block-method block_method_test block_method_color">{{item.method}}</span>
                                        <input class="block-test-name"
                                               v-model="item.name"
                                        />
                                        <el-button
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
        </el-main>
    </el-container>


</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        props: {
            project: {
                require: true
            }
        },
        name: "AddTest",
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },

        data() {
            return {
                length: 0,
                name: '',
                currentTest:'',
                currentAPI: '',
                currentNode: '',
                data: '',
                filterText: '',
                expand: '&#xe667;',
                dataTree: [],
                apiData: [
                    {results: []}
                ],

                testData: []
            }
        },
        methods: {
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
        height: 600px;
    }

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
        height: 610px;
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

    .block_test {
        border: 1px solid #49cc90;
        background-color: rgba(236,248,238,.4)
    }

    .block_post {
        border: 1px solid #49cc90;
        background-color: rgba(73, 204, 144, .1)
    }

    .block_method_post {
        background-color: #49cc90;
    }

    .block_method_test {
        background-color: #909399;
    }

    .block_put {
        border: 1px solid #fca130;
        background-color: rgba(252, 161, 48, .1)
    }

    .block_method_put {
        background-color: #fca130;
    }

    .block_get {
        border: 1px solid #61affe;
        background-color: rgba(97, 175, 254, .1)
    }

    .block_method_get {
        background-color: #61affe;
    }

    .block_delete {
        border: 1px solid #f93e3e;
        background-color: rgba(249, 62, 62, .1)
    }

    .block_method_delete {
        background-color: #f93e3e;
    }

    .block_patch {
        border: 1px solid #50e3c2;
        background-color: rgba(80, 227, 194, .1)
    }

    .block_method_patch {
        background-color: #50e3c2;
    }

    .block_head {
        border: 1px solid #e6a23c;
        background-color: rgba(230, 162, 60, .1)
    }

    .block_method_head {
        background-color: #e6a23c;
    }

    .block_options {
        border: 1px solid #409eff;
        background-color: rgba(64, 158, 255, .1)
    }

    .block_method_options {
        background-color: #409eff;
    }

    .block {
        border-radius: 4px;
        height: 43.6px;
        padding: 5px;
        display: flex;
        margin-top: 10px;
        align-items: center;
    }

    .block_url {
        color: inherit;
    }

    .block_method_color {
        cursor: pointer;
        color: #fff;
    }

    .block-method {
        font-size: 14px;
        font-weight: 600;
        min-width: 80px;
        padding: 6px 15px;
        text-align: center;
        border-radius: 3px;
        text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
        font-family: Titillium Web, sans-serif;
    }

    .block-summary-description {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        font-family: Open Sans, sans-serif;
        color: #3b4151;

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
        background: rgba(236,248,238,.4)

    }

    .block_body {
        height: auto;
        margin-top: 0px;
        padding: 0px;
    }

    h4 {
        display: block;
        -webkit-margin-before: 1.33em;
        -webkit-margin-after: 1.33em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;
    }

</style>
