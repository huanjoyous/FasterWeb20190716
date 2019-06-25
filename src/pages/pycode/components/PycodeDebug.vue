<template>
    <el-container>
        <el-header style="background-color: #F7F7F7;; padding: 0; height: 40px;">
            <div style="padding-top: 5px; margin-left: 10px; ">
                <el-row>
                    <el-col :span="15">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-circle-check-outline"
                            @click="handleConfirm"
                            round
                        >点击保存
                        </el-button>

                        <el-button
                            icon="el-icon-caret-right"
                            type="info"
                            size="mini"
                            @click="handleRunCode"
                            round
                        >
                            在线运行
                        </el-button>
                    </el-col>
                    <el-col :span="9">
                        <h3>调试控制台</h3>
                    </el-col>
                </el-row>
            </div>

        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 8px">
                <el-row>
                    <el-col :span="15">
                        <editor
                            v-model="requestData.code"
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

                    <el-col :span="9">
                        <editor
                            v-model="resp.msg"
                            lang="text"
                            theme="monokai"
                            width="100%"
                            :height="codeHeight"
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
        props: {
            id: {
                require: true
            }
        },
        data() {
            return {
                codeHeight: 500,
                requestData: {
                    code: '',
                    id: '',
                    project: this.$route.params.id
                },
                resp: {
                    msg: ''
                }
            }
        },
        name: "PycodeDebug",
        methods: {
            handleRunCode() {
                this.handleConfirm();
                this.resp.msg = '';
                this.$api.runPycode(this.requestData.id,{params:{project:this.$route.params.id}}).then(resp => {
                    this.resp = resp.data;
                })
            },

            handleConfirm() {
                this.$api.updatePycode(this.id, {project: this.$route.params.id}, this.requestData).then(resp => {
                    this.$notify.success("代码保存成功");
                    this.getPycode();
                })
            },
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                require('brace/snippets/python');
            },
            getPycode() {
                this.$api.getPycode(this.id,{params:{project: this.$route.params.id}}).then(res => {
                    this.requestData = res.data;
                })
            }
        },
        components: {
            editor: require('vue2-ace-editor')
        },
        mounted() {
            this.$nextTick( function () {
                this.getPycode();
                this.codeHeight = window.screen.height - 284;
            })
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
