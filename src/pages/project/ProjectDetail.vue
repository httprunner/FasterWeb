<template>

    <div >
        <ul class="title-project">
            <li class="title-li" title="Test API Project">
                <b>{{projectInfo.name}}</b>
                <b class="desc-li">{{projectInfo.desc}}</b>

            </li>
        </ul>

        <ul class="project_detail">
            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe74a;</i> &nbsp;{{projectInfo.api_count}} 个接口</p>
                <p class="desc-p">接口总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe6da;</i> &nbsp;{{projectInfo.case_count}} 个用例</p>
                <p class="desc-p">用例集总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xee32;</i> &nbsp;{{projectInfo.config_count}} 套配置</p>
                <p class="desc-p">配置总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe692;</i> &nbsp;{{projectInfo.variables_count}} 对变量</p>
                <p class="desc-p">全局变量对数</p>
            </li>
        </ul>

        <ul class="project_detail">
            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe609;</i> &nbsp;{{projectInfo.host_count}} 套环境</p>
                <p class="desc-p">环境总数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe61e;</i> &nbsp;{{projectInfo.task_count}} 项任务</p>
                <p class="desc-p">定时任务个数</p>
            </li>

            <li class="pull-left">
                <p class="title-p"><i class="iconfont">&#xe66e;</i> &nbsp;{{projectInfo.report_count}} 个报告</p>
                <p class="desc-p">测试报告总数</p>
            </li>

          
        </ul>


    </div>
</template>

<script>
    export default {
        name: "ProjectDetail",
        data() {
            return {
                projectInfo: {}
            }
        },
        methods: {
            success(resp) {
                this.$notify({
                    message: resp["msg"],
                    type: 'success',
                    duration: 1000
                });
            },
            failure(resp) {
                this.$notify.error({
                    message: resp.msg,
                    duration: 1000
                });
            },

            getProjectDetail() {
                const pk = this.$route.params.id;
                this.$api.getProjectDetail(pk).then(res => {
                    this.projectInfo = res
                })
            }
        },
        mounted() {
            this.getProjectDetail();
        }
    }
</script>

<style scoped>


    .desc-p {
        padding-top: 10px;
        font-size: 12px;
        color: #b6b6b6;
    }

    .title-p {
        font-size: 18px;
        margin-top: 10px;
    }

    .title-project li a {
        font-size: 12px;
        text-decoration: none;
        color: #a3a3a3;
        margin-left: 20px;

    }

    .pull-left {
        float: left;
        margin-left: 10px;
    }

    .project_detail li {
        margin-top: 10px;
        text-indent: 20px;
        display: inline-block;
        height: 90px;
        width: calc(20% - 1.5px);
        border: 1px solid #ddd;
    }

    .project_detail {
        height: 100px;
        margin-top: 20px;
    }

    .title-project {
        margin-top: 40px;
        margin-left: 10px;
    }

    ul li {
        list-style: none;
    }

    .title-li {
        font-size: 24px;
        color: #607d8b;
    }

    .desc-li {
        margin-top: 10px;
        color: #b6b6b6;
        font-size: 14px;
    }
</style>
