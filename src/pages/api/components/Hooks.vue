<template>
    <el-table
        highlight-current-row
        strpe
        max-height="470"
        :data="tableData"
        style="width: 100%;"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
    >
        <el-table-column
            fixed
            label="setup_hooks"
            width="400">
            <template slot-scope="scope">
                <el-input clearable
                          v-model="scope.row.setup"
                          placeholder="setup_hooks function"
                >
                </el-input>
            </template>
        </el-table-column>

        <el-table-column
            fixed
            label="teardown_hooks"
            width="400">
            <template slot-scope="scope">
                <el-input clearable
                          v-model="scope.row.teardown"
                          placeholder="teardown_hooks function"
                >
                </el-input>
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

</template>

<script>
    export default {
        props:{
            save: Boolean,
            hooks: {
                require:false
            }
        },

        watch: {
            save: function () {
                this.$emit('hooks', this.parse_hooks());
            },

            hooks: function () {
              this.tableData = this.hooks;
            }
        },

        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleEdit(index, row, flag) {
                this.tableData.push({
                    setup: '',
                    teardown: ''
                });
            },

            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },

            parse_hooks() {
                let hooks = {
                    setup_hooks: [],
                    teardown_hooks: []
                };
                for (let content of this.tableData) {
                    if (content.setup !== '') {
                        hooks.setup_hooks.push(content.setup);
                    }
                    if (content.teardown !== '') {
                        hooks.teardown_hooks.push(content.teardown);
                    }
                }
                return hooks;
            }
        },
        data() {
            return {
                currentRow: '',
                tableData: this.hooks
            }
        },
        name: "Hooks"
    }
</script>

<style scoped>
</style>
