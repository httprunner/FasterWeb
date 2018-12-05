<template>
  <div class="locust" style="height: 900px">
    <el-card class="box-card" style="height: 48px">
      <div slot="header" class="clearfix header">
        <span><i class="iconfont">&#xe63c;</i>&nbsp;&nbsp;压力测试</span>
      </div>
    </el-card>
    <el-table :data="results" tooltip-effect="dark" size="medium" style="width: 100%">
      <el-table-column
        v-for="(item, index) in scheduleSheetColumn"
        :key="index"
        :show-overflow-tooltip="true"
        :width="item.width"
        :prop="item.prop"
        align="left"
        :label="item.name">
        <template slot-scope="scope">
          <span v-if="item.name==='压测环境地址'">
            <a :href="scope.row[item.prop]" target="_blank">{{scope.row[item.prop]|| '— —'}}</a>
          </span>
          <span v-else>{{scope.row[item.prop] || '— —'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-tooltip class="item" effect="dark" content="删除压测环境" placement="top">
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        json: {
          msg: 'demo of jsoneditor'
        },
        results: [],
        scheduleSheetColumn: [
          {
            name: '用例集名称',
            prop: 'suite_name'
          },
          {
            name: '环境名称',
            prop: 'config_name'
          }, {
            name: '环境地址',
            prop: 'config_url'
          }, {
            name: '压测平台端口',
            prop: 'port'
          }, {
            name: '压测环境地址',
            prop: 'url'
          }
        ]
      }
    },
    mounted() {
      this.getLocusts()
    },
    methods: {
      handleDelete(row) {
        this.$confirm('此操作将删除该压测环境, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let suite_id = row.suite_id
          this.$api.deleteLocustTest(suite_id).then(resp => {
            if (resp.success == true) {
              this.$message.success({
                message: resp.msg
              })
              this.getLocusts()
            } else {
              this.$message.error({
                message: resp.msg
              })
            }
          })
          this.getLocusts()
        })
      },
      getLocusts() {
        let tmp = []
        this.$api
          .getLocustEnvs(this.$route.params.id)
          .then(resp => {
            resp.forEach(e => {
              e.url = "http://" + this.$api.baseHost + ":" + e.port
              tmp.push(e)
            })
            this.results = tmp
          }).catch(resp => {
          this.$message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
          })
        })
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
