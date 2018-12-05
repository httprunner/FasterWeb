<template>
  <div class="schedule" style="height: 900px">
    <el-card class="box-card" style="height: 48px">
      <div slot="header" class="clearfix header">
        <span>定时任务</span>
        <div>
          <el-button size="mini" @click="scheduleInsertDialogEvent">新增</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table :data="pages.results" tooltip-effect="dark" size="medium" style="width: 100%">
        <el-table-column
          type="expand"
        >
          <template slot-scope="scope">
            <div>
              <table>
                <tr>
                  <th style="width: 300px">步骤ID</th>
                  <th style="width: 300px">任务名</th>
                  <th style="width: 300px">来源</th>
                  <th style="width: 300px">环境信息</th>
                </tr>
                <slot v-for="(report,index) in scope.row['details']">
                  <tr>
                    <td style="width: 300px">{{report['stepId']}}</td>
                    <td style="width: 300px">{{report['stepName']}}</td>
                    <td v-if="report['stepRef']==1" style="width: 200px">API模板</td>
                    <td v-else style="width: 300px">自动化测试集合</td>
                    <td style="width: 300px" v-html="showConfig(report['configId'])">
                    </td>
                  </tr>
                </slot>
              </table>
            </div>

          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in scheduleSheetColumn"
          :key="index"
          :show-overflow-tooltip="true"
          :width="item.width"
          :prop="item.prop"
          align="left"
          :label="item.name">
          <template slot-scope="scope">
            <span v-if="item.name==='通知人员'">
              <span v-for="i in scope.row[item.prop]">
              <el-popover trigger="hover" placement="top">
              <p>ID: {{ i.userId}}</p>
              <p>花名: {{ i.userName}}</p>
              <p>邮箱：{{ i.email}}</p>
              <div slot="reference" class="name-wrapper" style="display: inline-block">
                <el-tag size="medium">{{ i.userName }}</el-tag>
              </div>
              </el-popover>
              </span>
            </span>
            <span v-else-if="item.name==='结果发送'">
              <span v-if="scope.row[item.prop]==1">不发送结果</span>
              <span v-if="scope.row[item.prop]==2">失败后发送</span>
              <span v-if="scope.row[item.prop]==3">不管怎样都发送结果</span>
            </span>
            <span v-else>{{scope.row[item.prop] || '— —'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-tooltip class="item" effect="dark" content="立即运行一次" placement="top">
                <el-button
                  size="mini"
                  icon="el-icon-caret-right"
                  @click="handleRunOnce(scope.row)" round></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleEdit( scope.row)" round></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)" round></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px; float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="scheduleSheetPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pages.count">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="任务编辑" :visible.sync="cronVisable">
      <el-form :model="editCronSchedule">
        <el-form-item label="任务：" v-model="editCronSchedule.name">
          {{editCronSchedule.name}}
        </el-form-item>
        <el-form-item label="cron: ">
          <div class="cron">
            <el-popover v-model="editCronPopover">
              <cron @change="editCron" @close="editCronPopover=false" i18n="cn"></cron>
              <el-input slot="reference" style="width:220px" @click="editCronPopover=true"
                        v-model="editCronSchedule.cron" placeholder="请输入定时策略">
                {{editCronSchedule.cron}}
              </el-input>
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cronReset">取 消</el-button>
        <el-button type="primary" @click="modifyCron">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增定时任务" :visible.sync="scheduleInsertDialog" width="1000px">
      <el-container>
        <el-aside width="600px">
          <el-form ref="form" :model="form" label-width="140px" label-position="left">
            <el-form-item label="任务名：" required>
              <div class="block">
                <el-input v-model="form.name"
                          placeholder="定时任务名称"
                          style="width:220px">
                  {{form.name}}
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="添加步骤：">
              <div class="block">
                <el-cascader
                  expand-trigger="hover"
                  :options="options"
                  v-model="stepSelected"
                  :show-all-levels="false"
                  :props="propsColumn">
                </el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="添加步骤环境:">
              <el-select class="service-select-box" style="width:220px;display: inline-block"
                         @change="handleStepChange" v-model="selectConfig" size="normal"
                         placeholder="请选择联系人">
                <el-option
                  v-for="item in configList"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                  <span style="float: left">{{ item.name }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.base_url }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tag
                v-for="app in form.apps"
                :key="app"
                closable
                @close="handleClose"
                type='info'>
                {{app}}
              </el-tag>
            </el-form-item>
            <el-form-item label="cron: " required>
              <div class="cron">
                <el-popover v-model="cronPopover">
                  <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
                  <el-input slot="reference" style="width:220px" @click="cronPopover=true" v-model="form.cron"
                            placeholder="请输入定时策略">
                    {{form.cron}}
                  </el-input>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="联系人: " required>
              <el-select class="service-select-box" style="width:220px;display: inline-block"
                         @change="addPeople(peopleSelected)" v-model="peopleSelected" size="normal"
                         placeholder="请选择联系人">
                <el-option
                  v-for="item in selectPeople"
                  :key="item.id"
                  :label="item.username"
                  :value="item.username">
                </el-option>
              </el-select>
              <!-- <el-button size="small" @click="addPeople(peopleSelected)">添加</el-button> -->
              <el-table :data="form.users" tooltip-effect="dark" size="medium" style="width: 100%!important;">
                <el-table-column
                  prop="id"
                  align="left"
                  :show-overflow-tooltip="true"
                  label="ID">
                </el-table-column>
                <el-table-column
                  prop="username"
                  align="left"
                  :show-overflow-tooltip="true"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="email"
                  align="left"
                  :show-overflow-tooltip="true"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  prop="item.prop"
                  align="left"
                  label="操作">
                  <template slot-scope="scope">
                    <span class="tableBtn" @click="handleUserClose(scope.row)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="任务结果发送：">
              <el-select v-model="form.sendType" placeholder="请选择">
                <el-option
                  v-for="item in sendTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述：" required>
              <el-input
                type="textarea"
                style="width:220px"
                :rows="2"
                placeholder="定时任务描述"
                v-model="form.description">
                {{form.description}}
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSchedule">保存</el-button>
              <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-aside>
        <el-main>
          <div style="height: 100%;">
            <el-steps direction="vertical">
              <el-step
                v-for="(data,index) in form.steps"
                class="text-wrapper"
                :key="index"
                @click.native="stepsClick(data)"
                :description="'来源：'+data.refName+' 环境名：'+data.configName+' 环境地址：'+data.configUrl"
                :title="data.label"
              >
              </el-step>
            </el-steps>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
  import {cron} from 'vue-cron'

  export default {
    components: {cron},
    name: '',
    data() {
      return {
        refEnum: {
          1: 'API模板',
          2: '测试用例集'
        },
        selectConfig: '',
        configList: [],
        scheduleInsertDialog: false,
        cronVisable: false,
        editCronSchedule: {},
        stepSelected: [],
        sendTypes: [
          {
            value: 1,
            label: '不发送结果'
          },
          {
            value: 2,
            label: '失败后发送'
          },
          {
            value: 3,
            label: '不管怎样都发送结果'
          },
        ],
        options: [{
          id: 1,
          label: 'API模板',
          children: []
        }, {
          id: 2,
          label: '自动化测试',
          children: []
        }],
        optionsAdd: false,
        propsColumn: {
          value: 'id',
          children: 'children',
          label: 'label'
        },
        app: '',
        selectPeople: [],
        form: {
          name: '',
          desc: '',
          cron: '',
          sendType: 1,
          steps: [],
          users: []
        },
        ref: '',
        cronPopover: false,
        editCronPopover: false,
        appsheetForm: {
          searchStr: ''
        },
        pages: {
          previous: '',
          count: 0,
          next: '',
          results: []
        },
        scheduleSheetColumn: [
          {
            name: 'ID',
            prop: 'id'
          },
          {
            name: '任务名',
            prop: 'name'
          }, {
            name: 'cron',
            prop: 'cron'
          }, {
            name: '通知人员',
            prop: 'reporters'
          }, {
            name: '上次更新时间',
            prop: 'update_time'
          }, {
            name: '创建人',
            prop: 'responsible'
          },
          {
            name: '结果发送',
            prop: 'sendType'
          },
          {
            name: '备注',
            prop: 'desc'
          }
        ],
        scheduleSheetPage: 1,
        peopleSelected: '',
        appsheetInfo: {
          appsheetName: '',
          results: []
        },
        appsheetData: [],
        appsheetDialog: false,
        appsheetCount: 0,
        loading: false
      }
    },
    computed: {},
    mounted() {
      this.getScheduleSheetData(1)
      this.getPeoples()
      this.getConfigList()
    },
    methods: {
      showConfig: function (data) {
        let res = '--'
        this.configList.forEach(e => {
          if (e.id == data) {
            res = '环境名：' + e.name + '<br> 环境地址：' + e.base_url
            return;
          }
        })
        return res
      },
      getConfigList() {
        this.$api.allConfigList({params: {project: this.$route.params.id}}).then(resp => {
          this.configList = resp
        }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
      },
      scheduleInsertDialogEvent() {
        if (!this.optionsAdd) {
          this.getTests()
        }
        this.scheduleInsertDialog = true
      },
      stepsClick(data) {
        for (let k in this.form.steps) {
          if (this.form.steps[k].id === data.id && this.form.steps[k].ref === data.ref) {
            this.form.steps.splice(k, 1)
            this.$message({
              type: 'success',
              message: `成功移除任务列表项：` + data.label
            })
            break
          }
        }
      },
      getCascaderObj(val, opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.id == value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      },
      handleStepChange(config) {
        if (this.stepSelected.length == 0) {
          this.$message({
            type: 'error',
            message: `请先选择步骤`
          })
          this.selectConfig = ''
          return
        }
        let tmp = this.getCascaderObj(this.stepSelected, this.options).pop()
        let ref = this.stepSelected[0]
        if (ref === 1) {
          tmp.ref = 1
          tmp.refName = "API模板"
        } else {
          tmp.ref = 2
          tmp.refName = "自动化测试"
        }
        tmp.configId = config.id
        tmp.configName = config.name
        tmp.configUrl = config.base_url
        this.form.steps.push(tmp)
        this.stepSelected = []
        this.selectConfig = ''
      },
      handleSizeChange(size) {
        this.scheduleSheetPage = size
        this.getScheduleSheetData(size)
      },
      handleCurrentChange(size) {
        this.scheduleSheetPage = size
        this.getScheduleSheetData(size)
      }
      ,
      cronReset() {
        this.editCronSchedule = {
          id: -1,
          name: '',
          cron: ''
        }
        this.cronVisable = false
      }
      ,
      modifyCron() {
        this.$api.editTaskCron(this.$route.params.id, this.editCronSchedule.id, this.editCronSchedule).then(res => {
          if (res.success === true) {
            this.cronReset()
            this.getScheduleSheetData(1)
            this.$message({
              type: 'success',
              message: `成功运行`
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }
      ,
      handleRunOnce(row) {
        this.$api.runOnce(this.$route.params.id, row.id).then(res => {
          if (res.success === true) {
            this.getScheduleSheetData(1)
            this.$message({
              type: 'success',
              message: `成功运行`
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }
      ,
      handleDelete(row) {
        this.$confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.deleteTask(this.$route.params.id, row.id).then(res => {
            if (res.success === true) {
              this.$message({
                type: 'success',
                message: `删除成功`
              })
              this.getScheduleSheetData(1, 10)
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          });
        })
      }
      ,
      handleEdit(row) {
        this.editCronSchedule.id = row.id
        this.editCronSchedule.name = row.name
        this.editCronSchedule.cron = row.cron
        this.cronVisable = true
      }
      ,
      addSchedule() {
        let s = ''
        let details = []
        let repoeters = []
        this.form.steps.forEach((item, index) => {
          details.push({
            stepId: item.id,
            stepName: item.label,
            stepRef: item.ref,
            configId: item.configId
          })
        })
        this.form.users.forEach((item, index) => {
          repoeters.push({
            userId: item.id,
            userName: item.username,
            email: item.email
          })
        })
        let params = {
          name: this.form.name,
          desc: this.form.description,
          cron: this.form.cron,
          sendType: this.form.sendType,
          details: details,
          reporters: repoeters,
          responsible: this.$store.state.user
        }
        this.$api.addSchedule(this.$route.params.id, params).then(res => {
          if (res.success === true) {
            this.resetForm('form')
            this.$message({
              type: 'success',
              message: `添加成功`
            })
            this.getScheduleSheetData(1, 10)
          } else {
            this.resetForm('form')
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }
      ,
      changeCron(val) {
        this.form.cron = val
      }
      ,
      editCron(val) {
        this.editCronSchedule.cron = val
      }
      ,
      getPeoples() {
        this.$api.getUsers().then(res => {
          this.selectPeople = res
        })
      }
      ,
      resetForm(formName) {
        let tmp = {
          name: '',
          description: '',
          steps: [],
          cron: '',
          sendType: 1,
          users: [],
          recordSize: 10
        }
        this.form = tmp
        this.selectConfig = ''
        this.scheduleInsertDialog = false
      }
      ,
      handleClose(tag) {
        this.form.apps.splice(this.form.apps.findIndex(v => v === tag), 1)
      }
      ,
      addPeople(username) {
        this.selectPeople.forEach(element => {
          if (element.username === username) {
            for (let i = 0; i < this.form.users.length; i++) {
              if (this.form.users[i].id === element.id) {
                this.form.users.splice(i, 1)
              }
            }
            this.form.users.push(element)
            this.peopleSelected = ''
          }
        })
      }
      ,
      handleUserClose(row) {
        for (let i = 0; i < this.form.users.length; i++) {
          if (this.form.users[i].userId === row.userId) {
            this.form.users.splice(i, 1)
          }
        }
      },
      setRef(ref) {
        this.ref = ref
      },
      getTests() {
        this.loading = true
        this.$api
          .getTree(this.$route.params.id, {
            params: {
              type: 1
            }
          })
          .then(resp => {
            resp['tree'].forEach(e => {
              this.getTestDetails(e, 1, true)
            })
          })
        this.$api
          .getTree(this.$route.params.id, {
            params: {
              type: 2
            }
          }).then(resp => {
          resp['tree'].forEach(e => {
            this.getTestDetails(e, 2)
          })
        })
        this.optionsAdd = true
        this.loading = false
      }
      ,
      getTestDetails(res, type) {
        let projectId = this.$route.params.id
        let tmp = Object.assign(res)
        if (type === 1) {
          this.$api.apiList({
            params: {
              node: tmp.id,
              project: projectId
            }
          }).then(resp => {
            if (resp.results.length != 0) {
              resp.results.forEach(element => {
                tmp.children.push({
                  id: element.id,
                  label: element.method + '  ' + element.name
                })
              })
              this.options[0].children.push(tmp)
            } else {
              delete tmp.children
            }
          })
          if (typeof (res.children) != "undefined" && res.children.length != 0) {
            res.children.forEach(e => {
              this.getTestDetails(e, type)
            })
          }
        } else {
          this.$api.testList({
            params: {
              project: projectId,
              node: tmp.id
            }
          }).then(resp => {
            if (resp.results.length != 0) {
              resp.results.forEach(element => {
                tmp.children.push({
                  id: element.id,
                  label: element.name
                })
              })
              this.options[1].children.push(tmp)
            } else {
              delete tmp.children
            }
          })
          if (typeof (res.children) != "undefined" && res.children.length != 0) {
            res.children.forEach(e => {
              this.getTestDetails(e, type, false)
            })
          }
        }
      },
      getScheduleSheetData(page) {
        this.loading = true
        this.$api.getTaskList(this.$route.params.id, page).then(res => {
          this.pages = res
          this.loading = false
        })
      }
      ,
      clear() {
        this.getScheduleSheetData(1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tableBtn {
    color: #606266;
    margin: 0 10px 0 0;
    cursor: pointer;

    &:hover {
      color: #f05050;
    }

  }

  .el-transfer /deep/ .el-transfer__buttons {
    padding: 0 10px;
  }

  .radio {
    margin: 10px 5px;
  }

  .more {
    padding: 0 10px 20px 10px;
    font-size: 14px;
    color: #333333;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .receive {
    margin: 0;
    width: 84px;
    border-color: #f8a058;
    color: #f8a058;

    &
    :hover {
      border-color: #f8a058;
      color: #ffffff;
      background: #f8a058;
    }

  }

  .solving {
    margin: 0;
    width: 84px;
    border-color: #90c5ff;
    color: #90c5ff;

    &
    :hover {
      border-color: #90c5ff;
      color: #ffffff;
      background: #90c5ff;
    }

  }

  .solved {
    margin: 0;
    width: 84px;
    border-color: #67c23a;
    color: #67c23a;

    &
    :hover {
      border-color: #67c23a;
      color: #ffffff;
      background: #67c23a;
    }

  }

  .text-wrapper {
    white-space: pre-wrap;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }
</style>
