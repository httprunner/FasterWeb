<template>

  <el-container>
    <el-header style="background: #fff; padding: 0;height:50px">
      <div class="nav-api-header">
        <div style="padding-top: 0px; margin-left: 0px">
          <el-button type="success" size="small" icon="el-icon-circle-plus" @click="dialogVisible = true">
            新建分组
          </el-button>

          <el-dialog title="新建分组" :visible.sync="dialogVisible" width="30%" align="center">
            <el-form :model="nodeForm" :rules="rules" ref="nodeForm" label-width="100px" class="project">
              <el-form-item label="节点名称" prop="name">
                <el-input v-model="nodeForm.name"></el-input>
              </el-form-item>
            </el-form>

            <el-radio-group v-model="radio" size="small">
              <el-radio-button label="根节点"></el-radio-button>
              <el-radio-button label="子节点"></el-radio-button>
            </el-radio-group>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleConfirm('nodeForm')">确 定</el-button>
            </span>
          </el-dialog>

          <el-button :disabled="currentNode === '' " type="danger" size="small" icon="el-icon-delete"
                     @click="deleteNode">删除分组
          </el-button>

          <el-button :disabled="currentNode === '' " type="warning" size="small" icon="el-icon-circle-plus-outline"
                     @click="initResponse = true">添加接口
          </el-button>
          <el-dropdown type="primary" split-button size="small" icon="el-icon-upload">
            导入接口
            <el-dropdown-menu :v-model="importMode" slot="dropdown" slot-scope>
              <el-dropdown-item v-for="(key,index) in importMode" @click.native="handleImportMode(key.mode)"
                                :key="index">
                {{key.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dialog
            :title="importDialogTitle"
            :key="importDialogKey"
            :visible.sync="showImportDialog"
            width="25%"
            style="text-align: center"
          >
            <el-upload
              ref="upload"
              class="upload-demo"
              accept="application/json"
              :headers="headers"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              drag
              :action="getUploadUrl()"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传postman 导出的json文件，导出版本为2.1.0</div>
            </el-upload>
          </el-dialog>

          <el-button type="info" plain size="small" icon="el-icon-download" :disabled="currentNode === '' ">导出接口
          </el-button>

          <el-checkbox v-model="checked" style="margin-left: 40px;" :disabled="currentNode === ''">全选
          </el-checkbox>

          <el-button style="margin-left: 20px" type="primary" icon="el-icon-caret-right" circle size="mini"
                     :disabled="currentNode === ''"
                     @click="run = !run"></el-button>

          <el-button type="danger" icon="el-icon-delete" circle size="mini" :disabled="currentNode === ''"
                     @click="del = !del"></el-button>

          <el-tooltip class="item" effect="dark" content="环境信息" placement="top-start">
            <el-button plain size="small" icon="el-icon-view"></el-button>
          </el-tooltip>

          <el-select placeholder="请选择" size="small" tyle="margin-left: -6px" :disabled="currentNode === ''"
                     v-model="currentConfig">
            <el-option v-for="item in configOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

        </div>
      </div>
    </el-header>

    <el-container>
      <el-aside style="width: 260px; margin-top: 0px; ">
        <div class="nav-api-side">
          <div class="api-tree">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="medium" clearable prefix-icon="el-icon-search">
            </el-input>

            <div class="operation-li">
              <el-tree @node-click="handleNodeClick" :data="dataTree" node-key="id" :default-expand-all="false"
                       :expand-on-click-node="false" draggable highlight-current :filter-node-method="filterNode"
                       ref="tree2">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span><i class="iconfont" v-html="expand"></i>&nbsp;&nbsp;{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-aside>

      <el-main style="padding: 0; ">
        <api-body v-show="addAPIFlag" :nodeId="currentNode.id" :project="$route.params.id" :response="response"
                  :config="currentConfig"
                  v-on:addSuccess="handleAddSuccess">
        </api-body>

        <api-list v-show="!addAPIFlag" :checked="checked" v-on:api="handleAPI"
                  :node="currentNode !== '' ? currentNode.id : '' "
                  :project="$route.params.id" :del="del" :back="back" :run="run" :config="currentConfig">
        </api-list>

      </el-main>
    </el-container>
  </el-container>
</template>


<style>
  .transfer-footer {
    margin-left: 0px;
    /* padding: 6px 5px; */
  }
</style>
<script>
  import ApiBody from './components/ApiBody'
  import ApiList from './components/ApiList'
  // import EurekaService from './extends/EurekaService'

  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    components: {
      ApiBody,
      ApiList
    },

    computed: {
      headers() {
        return {
          'TOKEN': this.$store.state.token
        }
      },
      initResponse: {
        get() {
          return this.addAPIFlag
        },
        set(value) {
          this.addAPIFlag = value
          this.response = {
            id: '',
            body: {
              name: '',
              times: 1,
              url: '',
              method: 'POST',
              header: [{
                key: '',
                value: '',
                desc: ''
              }],
              request: {
                data: [{
                  key: '',
                  value: '',
                  desc: '',
                  type: 1
                }],
                params: [{
                  key: '',
                  value: '',
                  desc: '',
                  type: 1
                }],
                json_data: ''
              },
              validate: [{
                expect: '',
                actual: '',
                comparator: 'equals',
                type: 1
              }],
              variables: [{
                key: '',
                value: '',
                desc: '',
                type: 1
              }],
              extract: [{
                key: '',
                value: '',
                desc: ''
              }],
              hooks: [{
                setup: '',
                teardown: ''
              }]
            }
          }
        }
      }
    },
    data() {
      return {
        uploadUrl: '',
        importDialogTitle: '',
        importDialogKey: '',
        back: false,
        checked: false,
        del: false,
        run: false,
        showImportDialog: false,
        response: '',
        nodeForm: {
          name: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入节点名称',
            trigger: 'blur'
          },
            {
              min: 1,
              max: 50,
              message: '最多不超过50个字符',
              trigger: 'blur'
            }
          ]
        },
        radio: '根节点',
        addAPIFlag: false,
        currentConfig: '',
        treeId: '',
        maxId: '',
        dialogVisible: false,
        currentNode: '',
        data: '',
        filterText: '',
        expand: '&#xe65f;',
        dataTree: [],
        configOptions: [],
        showServiceInfo: false,
        count: 1,
        selectApi: [],
        importMode: [
          {
            mode: 'postman_collection',
            label: 'Postman 集合数据导入'
          },
          {
            mode: 'postman_config',
            label: 'postman 环境信息导入'
          }
        ],
        config: {
          "parameters": {
            "parameters": [],
            "desc": {}
          },
          "header": {
            "header": {},
            "desc": {}
          },
          "request": {
            "form": {
              "data": {},
              "desc": {}
            },
            "json": {},
            "params": {
              "params": {},
              "desc": {}
            },
            "files": {
              "files": {},
              "desc": {}
            }
          },
          "variables": {
            "variables": [],
            "desc": {}
          },
          "hooks": {
            "setup_hooks": [],
            "teardown_hooks": []
          },
          "base_url": '',
          "name": '',
          "project": -1
        }
      }
    },
    methods: {
      handleUploadSuccess(response, file, fileList) {
        this.$message.success({
          message: '成功上传文件!',
          duration: 1000
        })
        this.$refs.upload.clearFiles()
        this.showImportDialog = false

      },
      handleUploadError(response, file, fileList) {
        this.$message.error({
          message: response.data.msg,
          duration: 1000
        })
        this.$refs.upload.clearFiles()
        this.showImportDialog = false
      },
      getUploadUrl() {
        let type;
        if (this.importDialogkey === "postman_collection") {
          type = 1
        } else if (this.importDialogkey === "postman_config") {
          type = 2
        }
        let project = this.$route.params.id

        let uploadUrl = `${this.$api.baseUrl}/api/extends/project/${project}/postman/${type}/upload`
        return uploadUrl
      },
      handleImportMode(mode) {
        if (mode === 'postman_collection') {
          this.importDialogTitle = "Postman API集合导入"
          this.importDialogkey = "postman_collection"
        } else if (mode === 'postman_config') {
          this.importDialogTitle = "Postman 环境配置导入"
          this.importDialogkey = "postman_config"
        }
        this.showImportDialog = true
      },
      handleAddSuccess() {
        this.back = !this.back
        this.addAPIFlag = false
      },

      handleAPI(response) {
        this.addAPIFlag = true
        this.response = response
      },

      getTree() {
        this.$api
          .getTree(this.$route.params.id, {
            params: {
              type: 1
            }
          })
          .then(resp => {
            this.dataTree = resp['tree']
            this.treeId = resp['id']
            this.maxId = resp['max']
          })
          .catch(resp => {
            this.$message.error({
              message: '服务器连接超时，请重试',
              duration: 1000
            })
          })
      },

      getConfig() {
        this.$api
          .getAllConfig(this.$route.params.id)
          .then(resp => {
            this.configOptions = resp
            this.configOptions.push({
              name: '请选择',
              id: ''
            })
          })
          .catch(resp => {
            this.$message.error({
              message: '服务器连接超时，请重试',
              duration: 1000
            })
          })
      },

      updateTree(mode) {
        this.$api
          .updateTree(this.treeId, {
            body: this.dataTree,
            node: this.currentNode.id,
            mode: mode,
            type: 1
          })
          .then(resp => {
            if (resp['success']) {
              this.$message.success(resp['msg'])
              this.dataTree = resp['tree']
              this.maxId = resp['max']
            } else {
              this.$message.error(resp['msg'])
            }
          })
          .catch(resp => {
            this.$message.error({
              message: '服务器连接超时，请重试',
              duration: 1000
            })
          })
      },

      deleteNode() {
        this.$confirm('此操作将永久删除该节点下所有接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.currentNode === '') {
            this.$message.info('请选择一个节点')
          } else {
            if (this.currentNode.children.length !== 0) {
              this.$message.warning('此节点有子节点，不可删除！')
            } else {
              this.remove(this.currentNode, this.data)
              this.updateTree(true)
            }
          }
        })
      },

      handleConfirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.append(this.currentNode)
            this.updateTree(false)
            this.dialogVisible = false
          }
        })
      },

      handleNodeClick(node, data) {
        this.addAPIFlag = false
        this.currentNode = node
        this.data = data
      },

      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },

      remove(data, node) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },

      append(data) {
        const newChild = {
          id: ++this.maxId,
          label: this.nodeForm.name,
          children: []
        }
        if (
          data === '' ||
          this.dataTree.length === 0 ||
          this.radio === '根节点'
        ) {
          this.dataTree.push(newChild)
          return
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
    },
    name: 'RecordApi',
    mounted() {
      this.getTree()
      this.getConfig()
    }
  }
</script>

<style scoped>
</style>
