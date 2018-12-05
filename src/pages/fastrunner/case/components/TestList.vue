<template>
  <el-container>
    <el-header style="padding: 0;height: 50px">
      <div style="padding-top: 8px; padding-left: 10px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="11"
          v-show="testData.count !== 0 "
          background
          layout="total, prev, pager, next, jumper"
          :total="testData.count"
        >
        </el-pagination>
      </div>
    </el-header>

    <el-container>
      <el-main style="padding: 0; margin-left: 10px;">
        <el-dialog
          v-if="dialogTableVisible"
          :visible.sync="dialogTableVisible"
          width="80%"
        >
          <report :summary="summary"></report>
        </el-dialog>
        <el-table
          ref="multipleTable"
          :data="testData.results"
          :show-header="testData.count !== 0 "
          stripe
          style="width: 100%"
          height="570"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            label="用例集名称"
            width="420"
          >
            <template slot-scope="scope">
              <div>{{scope.row.name}}</div>
            </template>
          </el-table-column>

          <el-table-column
            width="300"
            label="更新时间"
          >
            <template slot-scope="scope">
              <div>{{scope.row.update_time|datetimeFormat}}</div>

            </template>
          </el-table-column>
          <el-table-column
            width="300"
          >
            <template slot-scope="scope">
              <el-row v-show="currentRow === scope.row">
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button
                    type="info"
                    icon="el-icon-edit"
                    circle size="mini"
                    @click="handleEditTest(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="运行"
                  placement="top"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-caret-right"
                    circle size="mini"
                    @click="handleRunTest(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="复制"
                  placement="top"
                >
                  <el-button
                    type="success"
                    icon="el-icon-document"
                    circle size="mini"
                    @click="handleCopyTest(scope.row.id)"
                  >
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle size="mini"
                    @click="handleDelTest(scope.row.id)"
                  >
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="创建压测环境"
                  placement="top"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-circle-plus"
                    circle size="mini"
                    @click="showDialog(scope.row.id)"
                  >
                  </el-button>
                </el-tooltip>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :visible.sync="showLocustDialog"
          title="此操作将创建一个压测环境,是否继续?"
        >
          <el-card>
            <div slot="header" class="clearfix">
              <span>压测机数量</span>
            </div>
            <div>
              <el-slider
                v-model="locust_progress"
                :min="1"
                :max="4"
                :step="1"
                show-input>
              </el-slider>
            </div>
          </el-card>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetDialog">取 消</el-button>
            <el-button type="primary" @click="handleLocustTest">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  import Report from '../../../reports/DebugReport'

  export default {

    name: "TestList",
    components: {
      Report
    },

    props: {
      config: {
        require: true
      },
      back: Boolean,
      project: {
        require: true
      },
      node: {
        require: false
      },
      del: Boolean
    },

    watch: {
      node() {
        this.getTestList();
      },

      back() {
        this.getTestList();
      },

      del() {
        if (this.selectTest.length !== 0) {
          this.$confirm('此操作将永久删除测试用例集，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$api.delAllTest({data: this.selectTest}).then(resp => {
              this.getTestList();
            }).catch(resp => {
              this.$message.error({
                message: '服务器连接超时，请重试',
                duration: 1000
              })
            })
          })
        } else {
          this.$notify.warning({
            title: '提示',
            message: '请至少选择一个用例集',
            duration: 1000
          })
        }
      }
    },
    data() {
      return {
        dialogTableVisible: false,
        showLocustDialog: false,
        selectTest: [],
        summary: {},
        selectSuiteId: 0,
        locust_progress: 0,
        currentRow: '',
        testData: {
          count: 0,
          results: []
        },
        currentPage: 1,
      }
    },

    methods: {
      handleRunTest(id) {
        this.$api.runTestByPk(id, {params: {config: this.config, project: this.project}}).then(resp => {
          this.summary = resp;
          this.dialogTableVisible = true;
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },
      handleCurrentChange(val) {
        this.$api.getTestPaginationBypage({
          params: {
            page: this.currentPage,
            project: this.project,
            node: this.node
          }
        }).then(resp => {
          this.testData = resp;
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },
      resetDialog() {
        this.selectSuiteId = 0
        this.locust_progress = 0
        this.showLocustDialog = false
      },
      handleEditTest(id) {
        this.$api.editTest(id).then(resp => {
          this.$emit('testStep', resp);
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },

      handleCopyTest(id) {
        this.$prompt('请输入用例集名称', '提示', {
          confirmButtonText: '确定',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '用例集不能为空'
        }).then(({value}) => {
          this.$api.coptTest(id, {
            'name': value,
            'relation': this.node,
            'project': this.project
          }).then(resp => {
            if (resp.success) {
              this.getTestList();
            } else {
              this.$message.error(resp.msg);
            }
          }).catch(resp => {
            this.$message.error({
              message: '服务器连接超时，请重试',
              duration: 1000
            })
          })
        })
      },

      handleSelectionChange(val) {
        this.selectTest = val;
      },

      handleDelTest(id) {
        this.$confirm('此操作将永久删除该测试用例集，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$api.deleteTest(id).then(resp => {
            if (resp.success) {
              this.getTestList();
            } else {
              this.$message.error(resp.msg)
            }
          }).catch(resp => {
            this.$message.error({
              message: '服务器连接超时，请重试',
              duration: 1000
            })
          })
        })
      },
      showDialog(id) {
        this.selectSuiteId = id
        this.showLocustDialog = true
      },

      handleLocustTest() {
        if (this.config == '') {
          this.$notify.error({
            title: '提示',
            message: '请选择环境信息',
            duration: 1000
          })
          this.resetDialog()
          return
        }
        this.$api.createLocustTest(this.selectSuiteId, {
          params: {
            config: this.config,
            project: this.project,
            progress: this.locust_progress
          }
        }).then(resp => {
          if (resp.success) {
            this.$message.info({
              message: resp.msg,
            })
            this.resetDialog()
            this.$router.push({
              name: 'Locust',
              params: {
                id: this.project
              }
            });
          } else {
            this.$message.error(resp.msg)
          }
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },
      getTestList() {
        this.$api.testList({
          params: {
            project: this.project,
            node: this.node
          }
        }).then(resp => {
          this.testData = resp;
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },
      cellMouseEnter(row) {
        this.currentRow = row;
      },

      cellMouseLeave(row) {
        this.currentRow = '';
      },
    }
  }
</script>

<style scoped>
</style>
