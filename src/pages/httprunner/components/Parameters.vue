<template>
    <div style="margin-top: 5px">
        <el-table
            highlight-current-row
            strpe
            max-height="510"
            :data="tableData"
            style="width: 100%;"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
        >
            <el-table-column
                fixed
                label="Key"
                width="300"
            >
                <template slot-scope="scope">
                    <el-input clearable v-model="scope.row.key" placeholder="Key"></el-input>
                </template>
            </el-table-column>

            <el-table-column
                label="类型"
                width="120">
                <template slot-scope="scope">

                    <el-select v-model="scope.row.type">
                        <el-option
                            v-for="item in dataTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                </template>
            </el-table-column>

            <el-table-column
                label="Value"
                width="480">
                <template slot-scope="scope">
                    <el-input clearable
                              v-model="scope.row.value"
                              placeholder="Value"
                              v-show="scope.row.type === 1 "
                    >
                    </el-input>

                    <editor v-model="jsonData"
                            @init="editorInit"
                            lang="json"
                            theme="github"
                            width="100%"
                            height="40"
                            v-show="scope.row.type === 2 "
                    >
                    </editor>

                </template>
            </el-table-column>

            <el-table-column
                width="130">
                <template slot-scope="scope">
                    <el-row v-show="scope.row === currentRow">
                        <el-button
                            icon="el-icon-circle-plus-outline"
                            size="mini"
                            type="info"
                            @click="handleEdit(scope.$index, scope.row)">
                        </el-button>

                        <el-button
                            icon="el-icon-delete"
                            size="mini"
                            type="danger"
                            v-show="scope.$index !== 0"
                            @click="handleDelete(scope.$index, scope.row)">
                        </el-button>
                    </el-row>
                </template>

            </el-table-column>
        </el-table>


    </div>


</template>

<script>
    export default {
        name: "Parameters",
        components: {
            editor: require('vue2-ace-editor'),
        },
        methods: {
            editorInit() {
                require('brace/ext/language_tools')
                require('brace/mode/json')
                require('brace/theme/github')
                require('brace/snippets/json')
            },

            cellMouseEnter(row) {
                this.currentRow = row;
            },
            cellMouseLeave(row) {
                this.currentRow = '';
            },
            handleEdit(index, row) {
                this.tableData.push({
                    key: '',
                    value: '',
                    type: 1,
                });
            },
            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            }
        },
        data() {
            return {
                currentRow: '',
                jsonData: '{}',

                tableData: [{
                    key: '',
                    value: '',
                    type: 1,
                }],

                dataTypeOptions: [{
                    label: 'String',
                    value: 1
                }, {
                        label: 'List',
                        value: 2
                }]
            }
        }
    }
</script>

<style>
    .ace_editor {
        font-size: 20px;
    }

</style>
