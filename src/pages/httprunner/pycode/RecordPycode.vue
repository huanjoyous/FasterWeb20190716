<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        :disabled="PycodedebugActivate"
                        type="primary"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="dialogVisible = true"
                    >新增文件
                    </el-button>

                    <el-button
                        :disabled="PycodedebugActivate"
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="delSelectionPycodefile"
                    ></el-button>

                    <el-dialog
                        title="添加文件"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form :model="pycodefileForm"
                                 :rules="rules"
                                 ref="pycodefileForm"
                                 label-width="100px"
                                 class="project">
                            <el-form-item label="文件名称" prop="name">
                                <el-input v-model="pycodefileForm.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="文件描述" prop="desc">
                                <el-input v-model="pycodefileForm.desc" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('pycodefileForm')">确 定</el-button>
                      </span>
                    </el-dialog>
                    <el-dialog
                        title="编辑文件信息"
                        :visible.sync="editVisible"
                        width="30%"
                    >
                        <el-form :model="pycodefileForm"
                                 :rules="rules"
                                 ref="pycodefileForm"
                                 label-width="100px"
                                 class="project">
                            <el-form-item label="修改名称" prop="name">
                                <el-input v-model="pycodefileForm.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="修改描述" prop="desc">
                                <el-input v-model="pycodefileForm.desc" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                                                <el-button @click="editVisible = false">取 消</el-button>
                                                <el-button type="primary" @click="handleConfirm('pycodefileForm')">确 定</el-button>
                                            </span>
                    </el-dialog>

                    <el-button
                        :disabled="!PycodedebugActivate"
                        type="text"
                        style="position: absolute; right: 30px;"
                        @click="PycodedebugActivate=false"
                    >返回列表</el-button>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px" v-if="PycodedebugActivate">
                <PycodeDebug
                    :id="pycodeid"
                >
                </PycodeDebug>
            </el-main>
        </el-container>

        <el-container v-show="!PycodedebugActivate">
            <el-header style="padding: 0; height: 50px;">
                <div style="padding-top: 8px; padding-left: 30px; overflow: hidden">
                    <el-row :gutter="50">
                        <el-col :span="6">
                            <el-input placeholder="请输入文件名称" v-if="pycodeData.count > 11" clearable v-model="search">
                                <el-button slot="append" icon="el-icon-search" @click="getTestdataList"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="7">
                            <el-pagination
                                :page-size="11"
                                v-show="pycodeData.count !== 0 "
                                background
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="pycodeData.count"
                            >
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </el-header>

            <el-container>
                <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                    <div style="position: fixed; bottom: 0; right:0; left: 220px; top: 150px">
                        <el-table
                            highlight-current-row
                            :data="pycodeData.results"
                            :show-header="pycodeData.results.length !== 0 "
                            stripe
                            height="calc(100%)"
                            @cell-mouse-enter="cellMouseEnter"
                            @cell-mouse-leave="cellMouseLeave"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column
                                type="selection"
                                width="55"
                            >
                            </el-table-column>

                            <el-table-column
                                label="文件名"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.name}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="简要描述"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.desc}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="更新时间"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.update_time | datetimeFormat}}</div>

                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-row v-show="currentRow === scope.row">
                                        <el-button
                                            v-show="pycodeData.count !== 0"
                                            type="success"
                                            icon="el-icon-edit"
                                            circle size="mini"
                                            @click="handleEditPycodeData(scope.$index, scope.row)"
                                        >
                                        </el-button>
                                        <el-button
                                            v-show="pycodeData.count !== 0"
                                            type="success"
                                            icon="el-icon-document"
                                            circle size="mini"
                                            @click="handleEditPycode(scope.row.id)"
                                        >
                                        </el-button>
                                        <el-button
                                            v-show="pycodeData.count !== 0"
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="handleDelPycode(scope.row.id)"
                                        >
                                        </el-button>

                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    import PycodeDebug from './components/PycodeDebug'

    export default {
        components: {
            PycodeDebug
        },

        data() {
            return {
                back: false,
                del: false,
                PycodedebugActivate: false,
                respConfig: '',
                dialogVisible: false,
                editVisible: false,
                pycodefileForm: {
                    name: '',
                    desc: '',
                    project: this.$route.params.id,
                    id: ''
                },
                search: '',
                pycodeData: {
                    count: 0,
                    results: []
                },
                currentRow: '',
                currentPage: 1,
                selectTestData: [],
                rules: {
                    name: [
                        {required: true, message: '请输入文件全称', trigger: 'blur'},
                        {min: 1, max: 30, message: '最多不超过30个字符', trigger: 'blur'}
                    ],
                    desc: [
                        {required: false, message: '简要描述下该文件', trigger: 'blur'},
                        {min: 0, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ]
                },
                pycodeid: ''
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleSelectionChange(val) {
                this.selectTestData = val;
            },

            handleEditPycode(index){
                this.PycodedebugActivate = true;
                this.pycodeid = index;
            },

            handleDelPycode(index){
                this.$confirm('此操作将永久删除该测试文件，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deletePycode(index).then(resp => {
                        if (resp.success) {
                            this.$message.success(resp.msg);
                            this.PycodeList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            delSelectionPycodefile() {
                if (this.selectTestData.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的文件，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllPycode({data: this.selectTestData}).then(resp => {
                            this.$message.success(resp.msg);
                            this.PycodeList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少勾选一个文件',
                        duration: 1000
                    })
                }
            },
            handleCurrentChange(val) {
                this.$api.getPycodeListPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.pycodeData = resp;
                })
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.editVisible = false;
                        let obj;
                        if (this.pycodefileForm.id === '') {
                            obj = this.$api.addPycode(this.pycodefileForm);
                        } else {
                            obj = this.$api.updatePycode(this.pycodefileForm);
                        }
                        obj.then(resp => {
                            if (resp.success) {
                                this.$message.success(resp.msg);
                                this.PycodeList();
                            } else {
                                this.$message.error(resp.msg);
                            }

                            this.pycodefileForm.name = '';
                            this.pycodefileForm.desc = '';
                            this.pycodefileForm.id = '';
                        })
                    } else {
                        if (this.pycodefileForm.id !== '') {
                            this.editVisible = true;
                        } else {
                            this.dialogVisible = true;
                        }
                        return false;
                    }
                });
            },

            handleEditPycodeData(index, row){
                    this.editVisible = true;
                    this.pycodefileForm.name = row['name'];
                    this.pycodefileForm.desc = row['desc'];
                    this.pycodefileForm.id = row['id'];
            },

            PycodeList(){
                this.$api.getPycodeList({
                    params: {
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.pycodeData = resp;
                })
            }
        },
        name: "RecordPycode",
        mounted() {
            this.$nextTick( function () {
                this.PycodeList();
            })
        }
    }
</script>

<style scoped>


</style>
