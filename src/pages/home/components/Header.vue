<template>
    <div>
        <div class="nav-header">

            <span style="color: white; font-size: 25px; margin-left: 10px">FasterRunner 接口自动化测试平台</span>
            <span class="right">
                <div style="float: right; color: #d9d9d9; margin-right: 100px">

                    <i class="iconfont">&#xe61c;</i>

                    <span v-text="this.$store.state.user" style="padding-left: 5px; font-size: large"></span>
                    <a style="padding-left: 10px;" @click="handleLogOut">注 销</a>
                </div>
            </span>

        </div>
    </div>


</template>

<script>

    export default {
        methods: {
            handleLogOut () {
                this.$store.commit("isLogin", null);
                this.setLocalValue("token", null);
                this.$router.push({name:"Login"});
            }
        },
        name: "Header",

    }
</script>

<style scoped>
    .left {
        width: 180px;
        left: 20px;
        display: inline-block;
        position: fixed;
        z-index: 900;
        top: -5px;
    }

    .right {
        position: fixed;
        left: 300px;
        right: 0;
        top: 0;

    }

    .right div a:hover {
        color: darkcyan;
    }

    .logo {
        background: white;
        height: 40px;
    }

    .nav-header {
        background: #242F42;
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }

</style>
