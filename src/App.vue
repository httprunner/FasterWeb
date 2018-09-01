<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    html {
        height: 100%;
    }
    body {
        height:100%;
        width:100%;
        overflow:hidden;
        margin:0;
        padding:0;
        background: #fff;
        color: #333;
        font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "WenQuanYi Micro Hei", "Arial", sans-serif;
    }
</style>
