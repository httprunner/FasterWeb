<template>
    <div>
        <div class="nav-header">
            <el-row>
                <el-col :span="3">
                    <span style="width: 50px; display: inline-block">icon</span>
                    <span style="width: 126px; display: inline-block; border-right: 1px solid #ddd">Account</span>
                </el-col>
                <el-col :span="12">
                    <div style="padding: 18px">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                    </div>
                </el-col>
            </el-row>

        </div>
    </div>


</template>

<script>

    export default {
        data() {
            return {}
        },
        name: "Header",

    }
</script>

<style scoped>
    .nav-header {
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }

</style>
