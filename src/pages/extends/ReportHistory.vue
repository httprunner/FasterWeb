<template>
  <div class="ReportHistory" style="height: 900px">
    <el-card class="box-card" style="height: 48px">
      <div class="header">
        <span><i class="iconfont">&#xe66e;</i>&nbsp;&nbsp;测试报告</span>
      </div>
    </el-card>
    <el-tabs type="border-card">
      <el-tab-pane label="API模板" tabindex="1">
        <el-table
          tooltip-effect="dark"
          :data="apiData.results"
          v-loading="loading2"
          style="width: 100%;">
          <el-table-column
            v-for="(column, index) in releaseColumns"
            align="left"
            :show-overflow-tooltip="true"
            :key="index"
            :prop="column.prop"
            :label="column.label">
            <template slot-scope="scope">
              <span v-if="column.prop=='status'">
                <span>{{scope.row[column.prop] || '— —'}}</span>
              </span>
              <span v-else>{{scope.row[column.prop] || '— —'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            width="226px"
            label="操作">
            <template slot-scope="scope">
              <span class="release-tableBtn"
                    @click="showReport(scope.row)">查看报告</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            style="padding: 30px 0 15px 0;"
            background
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="apiData.count"
            :current-page.sync="apiPage"
            @size-change="handleApiSizeChange"
            @current-change="handleApiSizeChange">
          </el-pagination>
        </div>

      </el-tab-pane>
      <el-tab-pane label="自动化测试" tabindex="2"
      >
        <el-table
          tooltip-effect="dark"
          :data="testSetData.results"
          v-loading="loading2"
          style="width: 100%;">
          <el-table-column
            v-for="(column, index) in releaseColumns"
            align="left"
            :show-overflow-tooltip="true"
            :key="index"
            :prop="column.prop"
            :label="column.label">
            <template slot-scope="scope">
              <span v-if="column.prop=='status'">
                <span>{{scope.row[column.prop] || '— —'}}</span>
              </span>
              <span v-else>{{scope.row[column.prop] || '— —'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            width="226px"
            label="操作">
            <template slot-scope="scope">
              <span class="release-tableBtn"
                    @click="showReport(scope.row)">查看报告</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            style="padding: 30px 0 15px 0;"
            background
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="testSetData.count"
            :current-page.sync="testSetPage"
            @size-change="handleTestSetSizeChange"
            @current-change="handleTestSetSizeChange">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="定时任务" tabindex="3"
      >
        <el-table
          tooltip-effect="dark"
          :data="scheduleData.results"
          v-loading="loading2"
          style="width: 100%;"
        >
          <el-table-column
            type="expand"
          >
            <template slot-scope="scope">
              <div>
                <table>
                  <tr>
                    <th style="width: 300px">步骤名称</th>
                    <th style="width: 300px">来源</th>
                    <th style="width: 300px">结果</th>
                    <th style="width: 300px">操作</th>
                  </tr>
                <slot v-for="(report,index) in scope.row['reports']">
                  <tr>
                    <td v-if="report['detail']['stepRef']==1">
                      {{report['detail']['stepName']}}
                    </td>
                    <td v-else style="width: 200px">{{report['detail']['name']}}</td>
                    <td v-if="report['detail']['stepRef']==1">API模板</td>
                    <td v-else>自动化测试集合</td>
                    <td v-if="report['content']['success']==true"><el-button type="success" size="mini" round>success</el-button></td>
                    <td v-else-if="report['content']['success']==false"><el-button type="warning" size="mini" round>failure</el-button></td>
                    <td>
                        <span class="release-tableBtn"
                              @click="showDetailReport(report['content'])">查看报告</span>
                    </td>
                  </tr>
                </slot>
                </table>
              </div>

            </template>
          </el-table-column>
          <el-table-column
            v-for="(column, index) in scheduleColumns"
            align="left"
            :show-overflow-tooltip="true"
            :key="index"
            :prop="column.prop"
            :label="column.label">
            <template slot-scope="scope">
              <span v-if="column.prop=='status'">
                <span>{{scope.row[column.prop] || '— —'}}</span>
              </span>
              <span v-else>{{scope.row[column.prop] || '— —'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            style="padding: 30px 0 15px 0;"
            background
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="scheduleData.count"
            :current-page.sync="schedulePage"
            @size-change="handleScheduleSizeChange"
            @current-change="handleScheduleSizeChange">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      v-if="dialogTableVisible"
      :visible.sync="dialogTableVisible"
      width="70%"
      top="1vh"
    >
      <report :summary="summary"></report>
    </el-dialog>
  </div>
</template>
<script>
  import Report from '../reports/DebugReport'

  export default {
    name: "ReportHistory",
    data() {
      return {
        apiCount: 0,
        dialogTableVisible: false,
        summary: '',
        apiData: {},
        testSetData: {},
        scheduleData: {},
        releaseColumns: [
          {prop: 'name', label: '报告名称'},
          {prop: 'status', label: '测试结果'},
          {prop: 'update_time', label: '测试时间'},
        ],
        scheduleColumns: [
          {prop: 'name', label: '报告名称'},
          {prop: 'update_time', label: '测试时间'},
        ],
        detailColumns: [
          {prop: "stepName", label: '步骤名称'},
          {prop: "stepRef", label: '来源'},
        ],
        editTab: '1',
        apiRef: 1,
        apiPage: 1,
        testSetRef: 2,
        testSetPage: 1,
        scheduleRef: 3,
        schedulePage: 1,
        loading1: false,
        loading2: false,
        loading3: false,
      }
    },
    components: {
      Report
    },
    mounted() {
      this.getData(this.apiPage, this.apiRef)
      this.getData(this.apiPage, this.testSetRef)
      this.getData(this.apiPage, this.scheduleRef)
    },
    methods: {
      getData(pageNumber, ref) {
        this.$api
          .getReportList(this.$route.params.id, pageNumber, ref).then(res => {
          if (ref === this.apiRef) {
            this.apiData = res
          } else if (ref === this.testSetRef) {
            this.testSetData = res
          } else {
            this.scheduleData = res
          }
        })
      },
      handleApiSizeChange(pageNumber) {
        this.getData(pageNumber, this.apiRef)
      },
      handleTestSetSizeChange(pageNumber) {
        this.getData(pageNumber, this.testSetRef)
      },
      handleScheduleSizeChange(pageNumber) {
        this.getData(pageNumber, this.scheduleRef)
      },
      showReport(row) {
        let len = row.reports.length
        if (len === 1) {
          this.summary = row.reports[0].content
          this.dialogTableVisible = true
        }
      },
      showDetailReport(data) {
          this.summary = data
          this.dialogTableVisible = true
      },
      apiPageChange() {
      },
    }

  }
</script>
<style lang="less">
  .header {
    display: flex;
    justify-content: space-between;
  }

  .release {
    &-bread {
      margin-bottom: 36px;
    }
    &-tableBtn {
      margin: 0 5px;
      cursor: pointer;
    }
  }
</style>
