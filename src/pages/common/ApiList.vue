<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div>
                <div style="padding-top: 10px; margin-left: 10px">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="8"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                        </el-pagination>

                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <el-table
                    :data="apiData.results"
                    border
                    stripe
                    highlight-current-row
                    @row-dblclick="handleCellClick"
                    :row-style="{cursor:'pointer'}"
                    style="width: 100%;"
                >
                    <el-table-column
                        label="项目名称"
                        width="250"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <i class="iconfont">&#xe609;</i>
                            <span
                                style="margin-left: 10px; font-size: 18px; font-weight: bold">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="负责人"
                        width="150"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag style="font-size: 16px;">{{ scope.row.responsible }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="项目描述"
                        width="300"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag type="info" style="font-size: 16px;">{{ scope.row.desc }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="最后修改时间"
                        width="260"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag type="info" style="font-size: 16px;">{{ scope.row.update_time | datetimeFormat }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>


                    <el-table-column
                        label="操作"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="medium"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-dialog
                                title="编辑项目"
                                :visible.sync="editVisible"
                                width="30%"
                            >
                                <el-form :model="projectForm"
                                         :rules="rules"
                                         ref="projectForm"
                                         label-width="100px"
                                         class="project">
                                    <el-form-item label="项目名称" prop="name">
                                        <el-input v-model="projectForm.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目描述" prop="desc">
                                        <el-input v-model="projectForm.desc"></el-input>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
                            </el-dialog>
                            <el-button
                                size="medium"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "ApiList",

        data() {
            return {
                currentPage:1,
                apiData:[
                    {results:[]}
                ]
            }
        },

        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        },
    }
</script>

<style scoped>

</style>
