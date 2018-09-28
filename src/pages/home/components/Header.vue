<template>
    <div>
        <div class="nav-header">
           <span class="left" >
               <img src="~@/assets/images/logo-top.png" class="logo">
           </span>
            <span class="right">ssss</span>

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
    .left {
        width: 180px;
        display: inline-block;
        position: fixed;
        z-index: 900;
        top: 0;
    }

    .right {
        position: fixed;
        left: 181px;
        right: 0;
        top:0;

    }

    .logo {
        background: white;
        height: 40px;
    }

    .nav-header {
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }

</style>
