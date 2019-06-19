<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                  <el-button
                      type="primary"
                      size="small"
                      icon="el-icon-circle-plus-outline"
                      @click="dialogVisible=true"
                  >新增环境
                  </el-button>
                  <el-button
                    v-show="hostIPData.count !== 0"
                    style="margin-left: 20px"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="delSelectiontestdata"
                  ></el-button>

                    <el-dialog
                        title="添加环境"
                        :visible.sync="dialogVisible"
                        width="50%"
                        align="center"
                    >
                        <el-form
                            :model="variablesForm"
                            :rules="rules"
                            ref="variablesForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="环境名" prop="name">
                                <el-input resize v-model="variablesForm.name" clearable placeholder="请输入环境名"></el-input>
                            </el-form-item>
                            <el-form-item label="信息" prop="hostInfo">
                                <el-table
                                    highlight-current-row
                                    :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
                                    strpe
                                    :data="tableData"
                                    style="width: 100%;"
                                    @cell-mouse-enter="cellMouseEnterInside"
                                    @cell-mouse-leave="cellMouseLeaveInside"
                                >
                                    <el-table-column
                                        label="变量名"
                                        width="150"
                                    >
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.key" placeholder="Key" size="small"></el-input>
                                        </template>
                                    </el-table-column>


                                    <el-table-column
                                        label="变量值"
                                    >
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.value" placeholder="Value" size="small"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        label="描述"
                                        width="150">
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.desc" placeholder="变量简要描述" size="small"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        width="90"
                                    >
                                        <template slot-scope="scope">
                                            <el-row v-show="scope.row === currentRowInside">
                                                <el-button
                                                    icon="el-icon-circle-plus-outline"
                                                    circle size="mini"
                                                    type="info"
                                                    @click="handleEdit(scope.$index, scope.row)">
                                                </el-button>

                                                <el-button
                                                    icon="el-icon-delete"
                                                    circle size="mini"
                                                    type="danger"
                                                    v-show="tableData.length > 1"
                                                    @click="handleDelete(scope.$index, scope.row)">
                                                </el-button>
                                            </el-row>

                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('variablesForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                    <el-dialog
                        title="编辑环境"
                        :visible.sync="editdialogVisible"
                        width="50%"
                        align="center"
                    >
                        <el-form
                            :model="editVariablesForm"
                            :rules="rules"
                            ref="editVariablesForm"
                            label-width="100px"
                            class="project">
                            <el-form-item label="环境名" prop="name">
                                <el-input resize v-model="editVariablesForm.name" clearable
                                          placeholder="请输入环境名"></el-input>
                            </el-form-item>
                            <el-form-item label="信息" prop="hostInfo">
                                <el-table
                                    highlight-current-row
                                    :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
                                    strpe
                                    :data="editVariablesForm.hostInfo"
                                    style="width: 100%;"
                                    @cell-mouse-enter="cellMouseEnterInside"
                                    @cell-mouse-leave="cellMouseLeaveInside"
                                >
                                    <el-table-column
                                        width="150"
                                        label="变量名"
                                    >
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.key" placeholder="Key" size="small"></el-input>
                                        </template>
                                    </el-table-column>


                                    <el-table-column
                                        label="变量值"
                                    >
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.value" placeholder="Value" size="small"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        label="描述"
                                        width="150">
                                        <template slot-scope="scope">
                                            <el-input clearable v-model="scope.row.desc" placeholder="变量简要描述" size="small"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        width="90"
                                    >
                                        <template slot-scope="scope">
                                            <el-row v-show="scope.row === currentRowInside">
                                                <el-button
                                                    icon="el-icon-circle-plus-outline"
                                                    circle size="mini"
                                                    type="success"
                                                    @click="handleEditTableData(scope.$index, scope.row)">
                                                </el-button>

                                                <el-button
                                                    icon="el-icon-delete"
                                                    circle size="mini"
                                                    type="danger"
                                                    v-show="editTableData.length > 1"
                                                    @click="handleDeleteEditTableData(scope.$index, scope.row)">
                                                </el-button>
                                            </el-row>

                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="editdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleEditConfirm('editVariablesForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-header style="padding-top: 10px; height: 50px;">
                <div style="padding-left: 8px;">
                  <el-row>
                    <el-col :span="6" v-if="hostIPData.count > 11">
                      <el-input placeholder="请输入配置名称" clearable v-model="search">
                        <el-button slot="append" icon="el-icon-search" @click="getHostIPList"></el-button>
                      </el-input>
                    </el-col>
                    <el-col :span="7">
                      <el-pagination
                            :page-size="11"
                            v-show="hostIPData.count !== 0 "
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            layout="total, prev, pager, next, jumper"
                            :total="hostIPData.count"
                        >
                        </el-pagination>
                    </el-col>
                  </el-row>
                </div>
            </el-header>

            <el-container>
                <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                    <div style="position: fixed; bottom: 0; right:0; left: 178px; top: 150px">
                        <el-table
                            v-loading="loading"
                            element-loading-text="正在玩命加载"
                            highlight-current-row
                            :data="hostIPData.results"
                            :show-header="hostIPData.results.length !== 0 "
                            stripe
                            height="calc(100%)"
                            @cell-mouse-enter="cellMouseEnter"
                            @cell-mouse-leave="cellMouseLeave"
                            @selection-change="handleSelectionChange"
                        >

                          <el-table-column type="selection" width="55"></el-table-column>

                            <el-table-column label="环境名">
                                <template slot-scope="scope">
                                    <div>{{scope.row.name}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="更新时间">
                                <template slot-scope="scope">
                                    <div>{{scope.row.update_time|datetimeFormat}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间">
                                <template slot-scope="scope">
                                    <div>{{scope.row.create_time|datetimeFormat}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-row v-show="currentRow === scope.row">
                                        <el-button
                                            type="info"
                                            icon="el-icon-edit"
                                            circle size="mini"
                                            @click="handleEditHostIP(scope.row)"
                                        ></el-button>

                                        <el-button
                                            v-show="hostIPData.count !== 0"
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="handleDelHost(scope.row.id)"
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

    export default {

        data() {
            return {
                search: '',
                currentRow: '',
                currentPage: 1,
                currentRowInside: '',
                hostIPData: {
                    count: 0,
                    results: []
                },
                editdialogVisible: false,
                dialogVisible: false,
                variablesForm: {
                    name: '',
                    hostInfo: [],
                    project: this.$route.params.id
                },
                editVariablesForm: {
                    name: '',
                    hostInfo: [],
                    id: '',
                    project: this.$route.params.id
                },
                rules: {
                    name: [
                        {required: true, message: '请输入变量名', trigger: 'blur'},
                        {min: 1, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ]
                },
                loading: true,
                tableData: [{
                    key: '',
                    value: '',
                    desc: ''
                }],
                editTableData: [{
                    key: '',
                    value: '',
                    desc: ''
                }],
                selectHostInfo: [],
            }
        },
        methods: {
            cellMouseEnterInside(row) {
                this.currentRowInside = row;
            },

            cellMouseLeaveInside(row) {
                this.currentRowInside = '';
            },

            handleSelectionChange(val) {
                this.selectHostInfo = val;
            },

            handleEdit(index, row) {
                this.tableData.push({
                    key: '',
                    value: '',
                    desc: ''
                });
            },
            handleEditTableData(index, row) {
                this.editTableData.push({
                    key: '',
                    value: '',
                    desc: ''
                });
            },

            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },
            handleDeleteEditTableData(index, row) {
                this.editTableData.splice(index, 1);
            },
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },
            handleEditHostIP(row) {
                this.editVariablesForm = {
                    name: row.name,
                    hostInfo: row.hostInfo,
                    id: row.id,
                    project: this.$route.params.id
                };
                this.editTableData = this.editVariablesForm.hostInfo;
                this.editdialogVisible = true;
            },
            handleDelHost(index) {
                this.$confirm('此操作将永久删除该域名，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteHost(index, {params: {project: this.$route.params.id}}).then(resp => {
                        if (resp.status === 204) {
                            this.$notify.success({
                                message: '删除成功'
                            });
                            this.getHostIPList();
                        } else {
                            this.$notify.error({
                                message: resp
                            })
                        }
                    })
                })
            },

            handleCurrentChange(val) {
                this.$api.getHostPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id
                    }
                }).then(resp => {
                    this.hostIPData = resp;
                })
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.variablesForm.hostInfo = this.tableData;
                        this.$api.addHostIP(this.variablesForm).then(resp => {
                            this.variablesForm.name = '';
                            this.variablesForm.hostInfo = [{
                                key: '',
                                value: '',
                                desc: ''
                            }];
                            this.tableData = [{key: '', value: '', desc: ''}];
                            this.$notify.success('添加环境信息成功');
                            this.getHostIPList();
                        })
                    }
                });
            },

            handleEditConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editdialogVisible = false;
                        this.editVariablesForm.hostInfo = this.editTableData;
                        this.$api.updateHost(
                            this.editVariablesForm.id,
                            {project:this.editVariablesForm.project},
                            this.editVariablesForm
                        ).then(resp => {
                            this.$notify.success({
                                message: '更新成功'
                            });
                            this.getHostIPList();
                        })
                    }
                });
            },
            delSelectiontestdata() {
                if (this.selectHostInfo.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的配置，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                    this.$api.delAllHost({project:this.$route.params.id},this.selectHostInfo).then(resp => {
                        if (resp.status === 204) {
                            this.$notify.success('批量删除配置成功');
                            this.getHostIPList();
                        } else{
                            this.$notify.error('配置删除失败');
                        }
                    })
                    })
                } else {
                    this.$notify.warning({
                        message: '请至少勾选一个文件'
                    })
                }
            },

            getHostIPList() {
                this.$api.hostList({params: {project: this.$route.params.id}}).then(resp => {
                    this.hostIPData = resp;
                    this.loading = false;
                })
            },
        },
        name: "HostAddress",
        mounted() {
            this.getHostIPList();
        }
    }
</script>

<style>


</style>
