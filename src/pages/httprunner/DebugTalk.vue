<template>
    <el-container>
        <el-header style="background-color: #F7F7F7;; padding: 0; height: 50px;">
            <div style="padding-top: 10px; margin-left: 10px; ">
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-circle-check-outline"
                    @click="handleConfirm"
                    round
                >
                    点击保存
                </el-button>

                <el-button
                    icon="el-icon-caret-right"
                    type="info"
                    size="small"
                    @click="handleRunCode"
                    round
                >
                    在线运行
                </el-button>
            </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <el-row>
                    <el-col>
                        <editor
                            v-model="code.code"
                            @init="editorInit"
                            lang="python"
                            theme="monokai"
                            width="100%"
                            :height="codeHeight"
                            :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true
                             }"
                        >
                        </editor>
                    </el-col>


                </el-row>
                <div style="border: 1px solid #ddd"></div>

                <el-row>
                    <el-col>
                        <editor
                            v-model="resp.msg"
                            lang="text"
                            theme="monokai"
                            width="100%"
                            :height="consoleHeight"
                        >
                        </editor>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                codeHeight: 500,
                consoleHeight: 100,
                code: {
                    code: '',
                    id: ''
                },
                resp: {
                    msg: ''
                }
            }
        },
        name: "DebugTalk",
        methods: {
            handleRunCode() {
                this.$api.runDebugtalk(this.code).then(resp => {
                    this.resp = resp;
                }).catch(resp => {
                    this.$message.error({
                        message: '服务器连接超时，请重试',
                        duration: 1000
                    })
                })
            },

            handleConfirm() {
                this.$api.updateDebugtalk(this.code).then(resp => {
                    this.getDebugTalk();
                    this.$message.success("代码保存成功");
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
            editor: require('vue2-ace-editor')
        },
        mounted() {
            this.getDebugTalk();
            this.codeHeight = window.screen.height / 2;
            this.consoleHeight = window.screen.height /2 - 250;
        }
    }
</script>

<style scoped>

    .ace_editor {
        position: relative;
        overflow: hidden;
        font: 18px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
        direction: ltr;
        text-align: left;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

</style>
