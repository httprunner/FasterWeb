<template>
    <div>
        <div style="margin-top: 10px">
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
                placement="top-start"
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

        <div class="request">
            <el-tabs
                style="margin-left: 20px"
                v-model="activeTag"
            >
                <el-tab-pane label="Header" name="first">
                    <api-header :save="save"
                                v-on:header="handleHeader"
                                :header="response ? response.body.header: [{key:'', value:'', desc:''}] ">
                    </api-header>
                </el-tab-pane>

                <el-tab-pane label="Request" name="second">
                    <api-request
                        :save="save"
                        v-on:request="handleRequest"
                        :request="response ? response.body.request: {
                            data: [{
                                key: '',
                                value: '',
                                type: 1,
                                desc: ''
                            }],
                            params: [{
                                key: '',
                                value: '',
                                type: '',
                                desc: ''
                            }],
                            json_data:''
                        } "
                    >
                    </api-request>
                </el-tab-pane>

                <el-tab-pane label="Extract" name="third">
                    <api-extract
                        :save="save"
                        v-on:extract="handleExtract"
                        :extract="response ? response.body.extract : [{
                            key: '',
                            value: '',
                            desc: ''
                        }]"
                    >
                    </api-extract>
                </el-tab-pane>

                <el-tab-pane label="Validate" name="fourth">
                    <api-validate
                        :save="save"
                        v-on:validate="handleValidate"
                        :validate="response ? response.body.validate: [{
                            expect: '',
                            actual: '',
                            comparator: 'equals',
                            type: 1
                        }]"
                    >

                    </api-validate>
                </el-tab-pane>

                <el-tab-pane label="Variables" name="five">
                    <api-variables
                        :save="save"
                        v-on:variables="handleVariables"
                        :variables="response ? response.body.variables : [{
                            key: '',
                            value: '',
                            type: 1,
                            desc: ''
                        }]"
                    >

                    </api-variables>
                </el-tab-pane>

                <el-tab-pane label="Hooks" name="six">
                    <api-hooks
                        :save="save"
                        v-on:hooks="handleHooks"
                        :hooks="response ? response.body.hooks: [{
                            setup: '',
                            teardown: ''
                        }]"
                    >
                    </api-hooks>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
    import ApiHeader from './components/Header'
    import ApiRequest from './components/Request'
    import ApiExtract from './components/Extract'
    import ApiValidate from './components/Validate'
    import ApiVariables from './components/Variables'
    import ApiHooks from './components/Hooks'

    export default {
        components: {
            ApiHeader,
            ApiRequest,
            ApiExtract,
            ApiValidate,
            ApiVariables,
            ApiHooks

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
                this.addAPI();
            },

            addAPI() {
                if (this.url === '') {
                    this.$notify.error({
                        title: 'url错误',
                        message: '接口请求地址不能为空',
                        duration: 1500
                    })
                } else if (this.name === '') {
                    this.$notify.error({
                        title: 'name错误',
                        message: '接口名称不能为空',
                        duration: 1500
                    })
                } else {
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
                        project: this.project

                    }).then(resp => {
                        if (resp.success) {
                            this.$message.success({
                                message: '接口添加成功',
                                duration: 1000
                            })
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
            }
        },
        data() {
            return {
                times: 1,
                name: '',
                url: '',
                header: [],
                request: [],
                extract: [],
                validate: [],
                variables: [],
                hooks: [],
                method: 'POST',

                save: false,

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
        name: "Body"
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

</style>
