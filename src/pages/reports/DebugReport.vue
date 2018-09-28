<template>
    <div>
        <div
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

        </div>
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
