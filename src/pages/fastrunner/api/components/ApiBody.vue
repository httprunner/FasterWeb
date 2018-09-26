<template>
    <div>
        <div style="margin-top: 10px">
            <div>
                <el-input
                    style="width: 600px"
                    placeholder="请输入接口名称"
                    v-model="name"
                    clearable
                >
                    <template slot="prepend">接口信息录入</template>

                    <el-button
                        slot="append"
                        type="success"
                        plain
                        @click="save = !save"
                    >Save
                    </el-button>
                </el-input>

                <el-button
                    type="primary"
                    @click="reverseStatus"
                >Send
                </el-button>

                <el-dialog
                    v-if="dialogTableVisible"
                    :visible.sync="dialogTableVisible"
                    width="60%"
                    style="padding: 0"
                    center
                    title="API Request and Response"
                >
                    <div
                        class="popup"
                        v-for="test_suite in summary.details"
                    >

                        <div
                            class="content"
                            v-for="item in test_suite.records"
                        >

                            <div style="text-align: center; font-size: 20px; color: deepskyblue;">
                                {{item.name}} &nbsp;<span :class="item.status">{{item.status}}</span>
                            </div>

                            <h3>Request:</h3>
                            <div style="overflow: auto">
                                <table class="details">
                                    <tr v-for="(value, key) in item.meta_data.request">
                                        <th>{{ key }}</th>
                                        <td>
                                            <span v-if="key === 'headers' ">
                                                <div
                                                    v-for="(header_value, header_key) in item.meta_data.request.headers">
                                                    <strong>{{ header_key }}</strong>: {{ header_value }}
                                                </div>
                                            </span>

                                            <span v-else>
                                                {{ value }}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <h3>Response:</h3>
                            <div style="overflow: auto">
                                <table class="details">
                                    <tr
                                        v-if='["text", "json", "elapsed_ms", "response_time_ms", "content_size", "content_type"].indexOf(key) === -1'
                                        v-for="(value, key) in item.meta_data.response"
                                    >
                                        <th>{{ key }}</th>
                                        <td>
                                            <span v-if="key === 'headers' ">
                                                <div
                                                    v-for="(header_value, header_key) in item.meta_data.response.headers">
                                                <strong>{{ header_key }}</strong>: {{ header_value }}
                                                </div>
                                            </span>
                                            <span v-else-if="key === 'content' ">
                                                <img
                                                    v-if="item.meta_data.response.content_type.indexOf('image') !== -1 "
                                                    :src="item.meta_data.response.content"
                                                />
                                                <pre v-else>{{item.meta_data.response.text}}</pre>
                                            </span>
                                            <span v-else>{{value}}</span>

                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <h3>Validators:</h3>
                            <div style="overflow: auto">
                                <table class="details">
                                    <tr>
                                        <th>check</th>
                                        <th>comparator</th>
                                        <th>expect value</th>
                                        <th>actual value</th>
                                    </tr>
                                    <tr v-for="validator in item.meta_data.validators">
                                        <td class="passed" v-if="validator.check_result === 'pass' ">
                                        <td class="failed" v-if="validator.check_result === 'fail' ">
                                        <td class="unchecked" v-if="validator.check_result === 'unchecked' ">
                                            {{ validator.check}}
                                        </td>
                                        <td>{{ validator.comparator }}</td>
                                        <td>{{ validator.expect }}</td>
                                        <td>{{ validator.check_value }}</td>
                                    </tr>
                                </table>
                            </div>

                            <h3>Statistics:</h3>
                            <div style="overflow: auto">
                                <table class="details">
                                    <tr>
                                        <th>content_size(bytes)</th>
                                        <td>{{ item.meta_data.response.content_size }}</td>
                                    </tr>
                                    <tr>
                                        <th>response_time(ms)</th>
                                        <td>{{ item.meta_data.response.response_time_ms }}</td>
                                    </tr>
                                    <tr>
                                        <th>elapsed(ms)</th>
                                        <td>{{ item.meta_data.response.elapsed_ms }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                    </div>

                </el-dialog>


            </div>
            <div>
                <el-input
                    class="input-with-select"
                    placeholder="请输入接口请求地址"
                    v-model="url"
                    clearable=""
                >
                    <el-select
                        slot="prepend"
                        v-model="method"
                        size="small"
                    >
                        <el-option
                            v-for="item of httpOptions"
                            :label="item.label"
                            :value="item.label"
                            :key="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-input>

                <el-tooltip
                    effect="dark"
                    content="循环次数"
                    placement="bottom"
                >
                    <el-input-number
                        v-model="times"
                        controls-position="right"
                        :min="1"
                        :max="100"
                        style="width: 120px"
                    >
                    </el-input-number>
                </el-tooltip>
            </div>

        </div>

        <div class="request">
            <el-tabs
                style="margin-left: 20px"
                v-model="activeTag"
            >
                <el-tab-pane label="Header" name="first">
                    <headers :save="save"
                             v-on:header="handleHeader"
                             :header="response ? response.body.header: [] ">
                    </headers>
                </el-tab-pane>

                <el-tab-pane label="Request" name="second">
                    <request
                        :save="save"
                        v-on:request="handleRequest"
                        :request="response ? response.body.request: []"
                    >
                    </request>
                </el-tab-pane>

                <el-tab-pane label="Extract" name="third">
                    <extract
                        :save="save"
                        v-on:extract="handleExtract"
                        :extract="response ? response.body.extract : []"
                    >
                    </extract>
                </el-tab-pane>

                <el-tab-pane label="Validate" name="fourth">
                    <validate
                        :save="save"
                        v-on:validate="handleValidate"
                        :validate="response ? response.body.validate: []"
                    >

                    </validate>
                </el-tab-pane>

                <el-tab-pane label="Variables" name="five">
                    <variables
                        :save="save"
                        v-on:variables="handleVariables"
                        :variables="response ? response.body.variables : []"
                    >

                    </variables>
                </el-tab-pane>

                <el-tab-pane label="Hooks" name="six">
                    <hooks
                        :save="save"
                        v-on:hooks="handleHooks"
                        :hooks="response ? response.body.hooks: []"
                    >
                    </hooks>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
    import Headers from '../../../httprunner/components/Headers'
    import Request from '../../../httprunner/components/Request'
    import Extract from '../../../httprunner/components/Extract'
    import Validate from '../../../httprunner/components/Validate'
    import Variables from '../../../httprunner/components/Variables'
    import Hooks from '../../../httprunner/components/Hooks'

    export default {
        components: {
            Headers,
            Request,
            Extract,
            Validate,
            Variables,
            Hooks

        },

        props: {
            nodeId: {
                require: false
            },
            project: {
                require: false
            },
            response: {
                require: false
            }
        },
        methods: {
            reverseStatus() {
                this.save = !this.save;
                this.run = true;
            },

            handleHeader(header) {
                this.header = header;
            },
            handleRequest(request) {
                this.request = request;
            },
            handleValidate(validate) {
                this.validate = validate;
            },
            handleExtract(extract) {
                this.extract = extract;
            },
            handleVariables(variables) {
                this.variables = variables;
            },
            handleHooks(hooks) {
                this.hooks = hooks;
                // 调用后台
                if (!this.run) {
                    if (this.id === '') {
                        this.addAPI();
                    } else {
                        this.updateAPI();
                    }
                } else {
                    this.runAPI();
                    this.dialogTableVisible = true;
                    this.run = false;
                }
            },

            validateData() {
                if (this.url === '') {
                    this.$notify.error({
                        title: 'url错误',
                        message: '接口请求地址不能为空',
                        duration: 1500
                    });
                    return false;
                }

                if (this.name === '') {
                    this.$notify.error({
                        title: 'name错误',
                        message: '接口名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            updateAPI() {
                if (this.validateData()) {
                    this.$api.updateAPI(this.id, {
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url,
                        method: this.method,
                        name: this.name,
                        times: this.times,
                    }).then(resp => {
                        if (resp.success) {
                            this.$message.success({
                                message: '接口更新成功',
                                duration: 1000
                            });
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                }
            },

            runAPI() {
                if (this.validateData()) {
                    this.$api.runSingleAPI({
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url,
                        method: this.method,
                        name: this.name,
                        times: this.times,
                    }).then(resp => {
                        this.summary = resp;
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                }
            },

            addAPI() {
                if (this.validateData()) {
                    this.$api.addAPI({
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url,
                        method: this.method,
                        name: this.name,
                        times: this.times,
                        nodeId: this.nodeId,
                        project: this.project,

                    }).then(resp => {
                        if (resp.success) {
                            this.$message.success({
                                message: '接口添加成功',
                                duration: 1000
                            });
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    }).catch(resp => {
                        this.$message.error({
                            message: '服务器连接超时，请重试',
                            duration: 1000
                        })
                    })
                }
            }
        },

        watch: {
            response: function () {
                this.name = this.response.body.name;
                this.method = this.response.body.method;
                this.url = this.response.body.url;
                this.times = this.response.body.times;
                this.id = this.response.id;
            }
        },
        data() {
            return {
                times: 1,
                name: '',
                url: '',
                id: '',
                header: [],
                request: [],
                extract: [],
                validate: [],
                variables: [],
                hooks: [],
                method: 'POST',
                dialogTableVisible: false,
                save: false,
                run: false,
                summary: {},
                activeTag: 'first',
                httpOptions: [{
                    label: 'GET',
                }, {
                    label: 'POST',
                }, {
                    label: 'PUT',
                }, {
                    label: 'DELETE',
                }, {
                    label: 'HEAD',
                }, {
                    label: 'OPTIONS',
                }, {
                    label: 'PATCH',
                }],
            }
        },
        name: "ApiBody"
    }
</script>

<style scoped>
    .el-select {
        width: 130px;
    }

    .input-with-select {
        width: 600px;
        margin-top: 10px;
    }

    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }

    .details {
        width: 500px;
        margin-bottom: 20px;
    }

    .details th {
        background-color: skyblue;
        padding: 5px 12px;
    }

    .details tr .passed {
        background-color: lightgreen;
    }

    .details tr .failed {
        background-color: red;
    }

    .details tr .unchecked {
        background-color: gray;
    }

    .details td {
        background-color: lightblue;
        padding: 5px 12px;
    }


    .success {
        color: #67c23a;
    }

    .error {
        color: #e6a23c;
    }

    .failure {
        color: #f56c6c;
    }

    .skipped {
        color: #909399;
    }

    .popup h2 {
        margin-top: 0;
        color: #333;
        font-family: Tahoma, Arial, sans-serif;
    }

    .popup .close {
        position: absolute;
        top: 20px;
        right: 30px;
        transition: all 200ms;
        font-size: 30px;
        font-weight: bold;
        text-decoration: none;
        color: #333;
    }

    .popup .close:hover {
        color: #06d85f;
    }

    .popup .content {
        max-height: 80%;
        overflow: auto;
        text-align: left;
    }

    .details tr {
        color: black;
    }


</style>
