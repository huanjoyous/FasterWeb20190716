<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-upload
                        class="upload-demo"
                        :action="fileupload"
                        :show-file-list="false"
                        accept=".xlsx, .xls, .jpg, .png"
                        multiple
                        :limit="1"
                        :headers="uploadheader"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :before-upload="UploadBefore"
                        :data="filedata"
                        style="display: inline"
                    >
                        <el-button size="small" type="primary" icon="el-icon-upload" title="只能上传jpg/png/xlsx/xls文件">
                            点击上传
                        </el-button>
                    </el-upload>
                    <div style="display: inline"><el-button
                        v-show="testData.count !== 0 "
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="delSelectiontestdata"
                        title="批量删除"
                    ></el-button></div>

                </div>
            </div>
        </el-header>
        <el-container>
            <el-header style="padding: 0; height: 50px;">
                <div style="padding-top: 8px; padding-left: 30px; overflow: hidden">
                    <el-row :gutter="50">
                        <el-col :span="6">
                            <el-input placeholder="请输入文件名称" v-if="testData.count > 11" clearable v-model="search">
                                <el-button slot="append" icon="el-icon-search" @click="getTestdataList"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="7">
                            <el-pagination
                                :page-size="11"
                                v-show="testData.count !== 0 "
                                background
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="testData.count"
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
                            :data="testData.results"
                            :show-header="testData.results.length !== 0 "
                            stripe
                            height="600px"
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
                                label="更新时间"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.update_time | datetimeFormat}}</div>

                                </template>
                            </el-table-column>
                            <el-table-column
                                label="上传时间"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.create_time | datetimeFormat}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-row v-show="currentRow === scope.row">
                                        <el-button
                                            v-show="testData.count !== 0"
                                            type="success"
                                            icon="el-icon-download"
                                            circle size="mini"
                                            @click="handleDownTestdata(scope.row.id,scope.row.name)"
                                            title="下载"
                                        >
                                        </el-button>
                                        <el-button
                                            v-show="testData.count !== 0"
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="handleDelTestdata(scope.row.id)"
                                            title="删除"
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
    import store from '../../store/state'
    export default {
        name: "TestData",
        mounted() {
            this.$nextTick(function () {
                this.getTestdataList();
            })
        },
        data() {
            return {
                fileupload: this.$api.uploadFile(),
                fileList: [],
                filedata: {
                    project: this.$route.params.id,
                    name: ''
                },
                testData: {
                    count: 0,
                    results: []
                },
                uploadheader: {
                    Authorization: `JWT ${store.token}`
                },
                selectTestData: [],
                search: '',
                currentRow: '',
                currentPage: 1,
                loading: true
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleExceed(files, fileList) {
                this.$notify.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

            UploadBefore(file) {
                this.filedata.name = file.name;
            },

            uploadSuccess(response) {
                this.fileList = [];
                this.$notify.success('文件上传成功')
                this.getTestdataList()
            },

            uploadError(error) {
                if (error.status === 401) {
                    this.$notify.error('请先登录');
                    this.$router.replace({
                        name: 'Login'
                    })
                } else if (error.status === 403) {
                    this.$notify.error({
                        title: 'detail',
                        message: '您没有执行该操作的权限。'
                    })
                } else {
                    this.$notify.error('文件上传失败')
                }
            },

            delSelectiontestdata() {
                if (this.selectTestData.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的文件，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllTestdata({project: this.$route.params.id}, this.selectTestData).then(resp => {
                            this.$notify.success('批量删除文件完成');
                            this.getTestdataList();
                        })
                    })
                } else {
                    this.$notify.warning('请至少勾选一个文件')
                }
            },
            handleSelectionChange(val) {
                this.selectTestData = val;
            },
            handleCurrentChange(val) {
                this.$api.getTestdataListPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.filedata.project,
                        search: this.search
                    }
                }).then(resp => {
                    this.testData = resp;
                })
            },
            handleDownTestdata(index, filename) {
                this.$api.downloadTestdata({
                    "fileType": 1,
                    "id": index,
                    "project": this.$route.params.id
                }).then(resp => {
                    let url = window.URL.createObjectURL(new Blob([resp.data]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                }).catch(error => {
                    this.$notify.error('文件下载失败')
                })
            },
            handleDelTestdata(index) {
                this.$confirm('此操作将永久删除该测试文件，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteTestdata(index, {params: {project: this.$route.params.id}}).then(resp => {
                        this.$notify.success('文件删除成功');
                        this.getTestdataList();
                    })
                })
            },
            getTestdataList() {
                this.$api.testdataList({
                    params: {
                        project: this.filedata.project,
                        search: this.search
                    }
                }).then(resp => {
                    this.testData = resp;
                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped>

</style>
