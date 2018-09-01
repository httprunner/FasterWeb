<template>
    <div>
        <div class="nav-header">
            <ul class="header">
                <li class="li-first">1</li>
                <li class="li-second">you account</li>
                <li style="margin-left: 5px">
                    <el-input placeholder="请输入内容"
                              v-model="value"
                              :disabled="$store.state.searchButton"
                              class="input-with-select">

                        <el-select slot="prepend"
                                   v-model="key"
                                   :disabled="$store.state.searchButton"
                                   placeholder="请选择"
                                   style="width: 100px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-button :disabled="$store.state.searchButton"
                                   slot="append"
                                   icon="el-icon-search">

                        </el-button>
                    </el-input>
                </li>
            </ul>

        </div>
    </div>


</template>

<script>

    export default {
        data() {
            return {
                options: [{
                    value: 'case',
                    label: '用例'
                }, {
                    value: 'suite',
                    label: 'Suite'
                }, {
                    value: 'api',
                    label: '接口'
                }, {
                    value: 'config',
                    label: '环境'
                }],
                value: '',
                key: ''
            }
        },
        name: "Header",

    }
</script>

<style scoped>

    .search-input {
        border: 1px solid #ddd;
        width: 200px;
        height: 26px;
        border-radius: 3px;
    }

    .header {
        margin: 0;
        padding: 0;
    }

    .li-first {
        width: 50px;
        border-right: 1px solid #ddd;
    }

    .li-second {
        width: 145px;
        padding: 10px auto;
        border-right: 1px solid #ddd;
    }

    ul li {
        list-style: none;
    }

    .header li {
        display: inline-block;
        height: 50px;
    }

    .nav-header {
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }

</style>
