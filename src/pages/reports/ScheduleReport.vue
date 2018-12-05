<template>
  <div>
    <el-table
      :data="[summary]"
      size="medium"
      style="width: 100%"
      border
      stripe
      :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
      :cell-style="{textAlign:'center'}"
    >
      <el-table-column
        label="测试时间"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row['time']['start_at'])}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="持续时间"
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.time.duration<1">{{(scope.row.time.duration*1000).toFixed(2)}} ms</span>
          <span v-else-if="scope.row.time.duration>1">{{scope.row.time.duration.toFixed(2)}} s</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Total"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.stat.testsRun }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Success"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.stat.successes }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Failed"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.stat.failures }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Error"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.stat.errors }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Skipped"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.stat.skipped }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Platform"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>HttpRunner: {{ scope.row.platform.httprunner_version }}</p>
            <p>Python: {{ scope.row.platform.python_version }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.platform.platform }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

    </el-table>

    <br/>
    <br/>

    <slot v-for="item in summary.details">
      <div>
        <span style="font-weight: bold; font-size: medium">{{item.name}}</span>
        <el-popover
          placement="top-start"
          width="400"
          trigger="hover"
        >
          <pre class="code-block">{{item.in_out}}</pre>
          <el-button slot="reference" round type="text">parameters & output</el-button>
        </el-popover>

      </div>
      <el-table
        :data="item.records"
        style="width: 100%;overflow: auto"
        border
        :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
        :cell-style="{textAlign:'center'}"
        height="800px"
      >
        <el-table-column
          type="expand"
        >
          <template slot-scope="props">
            <el-tabs>
              <el-tab-pane label="Request">
                <pre style="height: 300px;overflow: auto" class="code-block" v-html="props.row.meta_data.request"></pre>
              </el-tab-pane>
              <el-tab-pane label="Response">
                <pre style="height: 300px;overflow: auto" class="code-block"
                     v-html="props.row.meta_data.response"></pre>
              </el-tab-pane>
              <el-tab-pane label="Validators" v-if="props.row.meta_data.validators.length !== 0">
                <pre style="height: 300px;overflow: auto" class="code-block"
                     v-html="props.row.meta_data.validators"></pre>
              </el-tab-pane>
              <el-tab-pane label="Attachment" v-if="props.row.attachment !== ''">
                <pre style="height: 300px;overflow: auto" class="code-block" v-html="props.row.attachment"></pre>
              </el-tab-pane>
            </el-tabs>

          </template>
        </el-table-column>

        <el-table-column
          label="名 称"
          width="250"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="请求地址"
          width="400"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.meta_data.request.url }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="请求方法"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.meta_data.request.method }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="响应时间 (ms)"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.meta_data.response.elapsed_ms }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="测试结果"
          sortable
        >
          <template slot-scope="scope">
            <div :class="scope.row.status">{{ scope.row.status }}</div>
          </template>
        </el-table-column>

      </el-table>
    </slot>
  </div>

</template>

<script>
  import * as api from '../../restful/api'

  export default {
    name: "ScheduleReport",
    data() {
      return {
        summary: ''
      }
    },
    mounted(){
      this.getSummary()
    },
    methods: {
      getSummary() {
        this.$api.getReport(this.$route.params.id).then(rsp => {
          this.summary = rsp
        })
      },
      dateFormat(time, format = 'YY-MM-DD hh:mm:ss') {
        console.log(time)
        if (parseInt(time).toString().length == 10) {
          time = parseInt(time * 1000)
        }
        let date = new Date(time);
        let year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          hour = date.getHours(),
          min = date.getMinutes(),
          sec = date.getSeconds();
        let preArr = Array.apply(null, Array(10)).map(function (elem, index) {
          return '0' + index;
        });

        let newTime = format.replace(/YY/g, year)
          .replace(/MM/g, preArr[month] || month)
          .replace(/DD/g, preArr[day] || day)
          .replace(/hh/g, preArr[hour] || hour)
          .replace(/mm/g, preArr[min] || min)
          .replace(/ss/g, preArr[sec] || sec);

        return newTime;
      }
    },
  }
</script>

<style scoped>
</style>
