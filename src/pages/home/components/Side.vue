<template>

    <el-menu
        class="common-side-bar"
        :default-active="$store.state.backButton === false ? defaultIndex : 'ProjectDetail'"
        background-color="#304056"
        text-color="#BFCBD9"
        active-text-color="#318DF1"
        @select="select"
    >
        <el-menu-item index="Index">
            <i class="el-icon-setting"></i>
            <span slot="title">首 页</span>
        </el-menu-item>

        <el-submenu index="ApiTest">
            <template slot="title">
                <i class="el-icon-view"></i>
                <span slot="title">接口自动化</span>
            </template>

            <el-menu-item-group>
                <el-menu-item index="ProjectList">
                    <span class="iconfont">&#xe7a7;</span>&nbsp;&nbsp;项目列表
                </el-menu-item>

                <el-menu-item v-for="item of side_menu" :index="item.url" :key="item.url" :disabled="!$store.state.backButton">
                    <span class="iconfont" v-html="item.code"></span>&nbsp;&nbsp;{{item.name}}
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="Pressure" disabled>
            &nbsp;<span class="iconfont">&#xe61f;</span>&nbsp;&nbsp;压力测试
        </el-menu-item>

        <el-menu-item index="DataBase">
            &nbsp;<span class="iconfont">&#xe782;</span>&nbsp;&nbsp;数据库管理
        </el-menu-item>

    </el-menu>
</template>

<script>
    export default {
        name: "Side",
        data() {
            return {
                defaultIndex: "Index",
                side_menu: [
                    {name: "项目概况", url: "ProjectDetail", code: "&#xe64a;"},
                    {name: "驱动代码", url: "DebugTalk", code: "&#xe7ca;"},
                    {name: "API 模板", url: "RecordApi", code: "&#xe74a;"},
                    {name: "测试用例", url: "AutoTest", code: "&#xe6da;"},
                    {name: "配置管理", url: "RecordConfig", code: "&#xee32;"},
                    {name: "全局变量", url: "GlobalEnv", code: "&#xe63c;"},
                    {name: "历史报告", url: "Reports", code: "&#xe66e;"},
                    {name: "定时任务", url: "Task", code: "&#xe61e;"},
                    // {name: "压力测试", url: "Pressure", code: "&#xe61f;"}
                ],
            }
        },
        methods:{
            select(url) {
                const array = ['DataBase', 'Index', 'ProjectList'];
                if (array.indexOf(url) !== -1 ) {
                    this.$store.commit('changeBackButton',false);
                }

                if(url === 'ProjectList' && this.$route.name !== 'ProjectList') {
                    this.$store.commit('changeBackButton',false);
                }

                this.$router.push({name:url})
            }
        }
    }
</script>

<style scoped>

    .common-side-bar {
        position: fixed;
        top: 48px;
        border-right: 1px solid #ddd;
        height: 100%;
        width: 202px;
        background-color: #fff;
        display: inline-block;
    }
</style>
