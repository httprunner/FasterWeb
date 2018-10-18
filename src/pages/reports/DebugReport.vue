<template>
    <div>
        <el-table
            :data="[summary]"
            size="medium"
            style="width: 100%"
            border
            stripe
            :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
            :cell-style="{textAlign:'center'}"
        >
            <el-table-column
                label="测试时间"
                width="160"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.time.start_at|timestampToTime}}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="持续时间"
                width="100"
            >
                <template slot-scope="scope">
                    <span v-text="scope.row.time.duration.toFixed(3)+' 秒'"></span>
                </template>
            </el-table-column>

            <el-table-column
                label="Total"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.stat.testsRun }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="Success"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag type="success">{{ scope.row.stat.successes }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="Failed"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag type="danger">{{ scope.row.stat.failures }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="Error"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag type="warning">{{ scope.row.stat.errors }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="Skipped"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag type="info">{{ scope.row.stat.skipped }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="Platform"
            >
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>HttpRunner: {{ scope.row.platform.httprunner_version }}</p>
                        <p>Python: {{ scope.row.platform.python_version }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.platform.platform }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

        </el-table>

        <br/>
        <br/>

        <slot v-for="item in summary.details">
            <div>
                <span style="font-weight: bold; font-size: medium">{{item.name}}</span>
                <el-popover
                    placement="top-start"
                    width="400"
                    trigger="hover"
                >
                    <pre class="code-block">{{item.in_out}}</pre>
                    <el-button slot="reference" round type="text">parameters & output</el-button>
                </el-popover>

            </div>
            <el-table
                :data="item.records"
                style="width: 100%"
                border
                :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
                :cell-style="{textAlign:'center'}"
            >
                <el-table-column
                    type="expand"
                >
                    <template slot-scope="props">
                        <el-tabs>
                            <el-tab-pane label="Request">
                                <pre class="code-block" v-html="props.row.meta_data.request"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Response">
                                <pre class="code-block" v-html="props.row.meta_data.response"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Validators" v-if="props.row.meta_data.validators.length !== 0">
                                <pre class="code-block" v-html="props.row.meta_data.validators"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Attachment" v-if="props.row.attachment !== ''">
                                <pre class="code-block" v-html="props.row.attachment"></pre>
                            </el-tab-pane>
                        </el-tabs>

                    </template>
                </el-table-column>

                <el-table-column
                    label="名 称"
                    width="250"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="请求地址"
                    width="400"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.meta_data.request.url }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="请求方法"
                    width="100"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.meta_data.request.method }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="响应时间 (ms)"
                    width="120"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.meta_data.response.elapsed_ms }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="测试结果"
                >
                    <template slot-scope="scope">
                        <div :class="scope.row.status">{{ scope.row.status }}</div>
                    </template>
                </el-table-column>

            </el-table>
        </slot>
        <!--<div
            class="popup"
            v-for="test_suite in summary.details"
        >
            <div
                class="content"
                v-for="item in test_suite.records"
            >
                <div style="text-align: center; font-size: 20px; color: deepskyblue; margin-top: 20px">
                    {{item.name}} &nbsp;<span :class="item.status">{{item.status}}</span>
                </div>

                <h3 class="title">Request:</h3>
                <div style="overflow: auto">
                    <table class="details">
                        <tr v-for="(value, key) in item.meta_data.request">
                            <slot v-if="value !== null">
                                <th>{{ key }}</th>
                                <td>
                                <span v-if="key === 'headers' ">
                                    <div
                                        v-for="(header_value, header_key) in item.meta_data.request.headers">
                                       {{ header_key }}: &nbsp;{{ header_value }}
                                    </div>
                                </span>
                                <span v-else>
                                {{ value }}
                                </span>
                                </td>
                            </slot>
                        </tr>
                    </table>
                </div>

                <h3 class="title">Response:</h3>
                <div style="overflow: auto">
                    <table class="details">
                        <tr
                            v-if='["text", "json", "elapsed_ms", "response_time_ms", "content_size", "content_type"].indexOf(key) === -1'
                            v-for="(value, key) in item.meta_data.response"
                        >
                            <slot v-if="value !== null">
                                <th>{{ key }}</th>
                                <td>
                                <span v-if="key === 'headers' ">
                                    <div
                                        v-for="(header_value, header_key) in item.meta_data.response.headers">
                                    {{ header_key }}: &nbsp;{{ header_value }}
                                    </div>
                                </span>
                                    <span v-else-if="key === 'content' ">
                                    <img
                                        v-if="item.meta_data.response.content_type.indexOf('image') !== -1 "
                                        :src="item.meta_data.response.content"
                                    />
                                    <pre v-else>{{item.meta_data.response.text}}</pre>
                                </span>

                                <span v-else-if="key === 'cookies' ">
                                    <div
                                        v-for="(cookie_value, cookie_key) in item.meta_data.response.cookies">
                                       {{ cookie_key }}: &nbsp;{{ cookie_value }}
                                    </div>
                                </span>

                                <span v-else>{{value}}</span>

                                </td>
                            </slot>
                        </tr>
                    </table>
                </div>

                <h3 class="title">Validators:</h3>
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

                <h3 class="title">Statistics:</h3>
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

                <div class="content" v-if="item.attachment">
                    <h3 class="title">Exceptions</h3>
                    <pre class="code-block">{{item.attachment}}</pre>
                </div>
            </div>

        </div>-->
    </div>

</template>

<script>
    export default {
        name: "DebugReport",
        props: {
            summary: {
                require: true
            }
        }
    }
</script>

<style scoped>

</style>
