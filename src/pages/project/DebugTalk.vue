<template>
    <el-container>
        <el-header style="background-color: #F7F7F7;; padding: 0; height: 50px">
            <div style="padding-top: 10px; margin-left: 10px">
                <el-button type="success"
                           size="small"
                           icon="el-icon-circle-check-outline"
                           @click="handleConfirm"
                >
                    点击保存
                </el-button>
            </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <div id="code">
                    <editor v-model="code.debugtalk"
                            @init="editorInit"
                            lang="python"
                            theme="monokai"
                            width="100%"
                            height="630"
                    >
                    </editor>
                </div>

            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                code: {
                    'debugtalk': '',
                    'id': ''
                }
            }
        },
        name: "DebugTalk",
        methods: {
            handleConfirm() {
                this.$api.updateDebugtalk(this.code).then(res => {
                    this.getDebugTalk();
                    this.$message.success("debugtalk.py保存成功");
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },
            editorInit() {
                require('brace/ext/language_tools')
                require('brace/mode/python')
                require('brace/theme/monokai')
                require('brace/snippets/python')
            },
            getDebugTalk() {
                this.$api.getDebugtalk(this.$route.params.id).then(res => {
                    this.code = res;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            }
        },
        components: {
            editor: require('vue2-ace-editor'),
        },
        mounted() {
            this.getDebugTalk();
        }
    }
</script>

<style>
    .ace_editor {
        font-size: 20px;
    }

</style>
