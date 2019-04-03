<template>
    <div>
        <div>
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
                    v-loading="loading"
                    :disabled="loading"
                >Send
                </el-button>
            </div>

            <div>
                <el-input
                    style="width: 600px; margin-top: 10px"
                    placeholder="请输入接口请求地址"
                    v-model="url"
                    clearable
                >
                    <el-select
                        style="width: 125px"
                        slot="prepend"
                        v-model="method"
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

            <el-dialog
                v-if="dialogTableVisible"
                :visible.sync="dialogTableVisible"
                width="70%"
            >
                <report :summary="summary"></report>
            </el-dialog>

            <el-tabs
                style="margin-left: 20px;"
                v-model="activeTag"
            >
                <el-tab-pane label="Header" name="first">
                    <headers
                        :save="save"
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
    import Report from '../../../reports/DebugReport'

    export default {
        components: {
            Headers,
            Request,
            Extract,
            Validate,
            Variables,
            Hooks,
            Report

        },

        props: {
            host: {
                require: false
            },
            nodeId: {
                require: false
            },
            project: {
                require: false
            },
            config: {
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

                if (!this.run) {
                    if (this.id === '') {
                        this.addAPI();
                    } else {
                        this.updateAPI();
                    }
                } else {
                    this.runAPI();
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
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            },

            runAPI() {
                if (this.validateData()) {
                    this.loading = true;
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
                        project: this.project,
                        config: this.config,
                        host:this.host
                    }).then(resp => {
                        this.summary = resp;
                        this.dialogTableVisible = true;
                        this.loading = false;
                    }).catch(resp => {
                        this.loading = false;
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
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
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
                loading: false,
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
                method: 'GET',
                dialogTableVisible: false,
                save: false,
                run: false,
                summary: {},
                activeTag: 'second',
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
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }


</style>
