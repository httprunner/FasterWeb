<template>
    <div>
        <div class="nav-header">
            <ul class="header">
                <li class="li-first">1</li>
                <li class="li-second">you account</li>
                <li style="margin-left: 5px">
                    logo
                </li>
            </ul>

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
    .header {
        margin: 0;
        padding: 0;
    }

    .li-first {
        width: 50px;
        border-right: 1px solid #ddd;
    }

    .li-second {
        width: 125px;
        padding: 10px auto;
        border-right: 1px solid #ddd;
    }

    ul li {
        list-style: none;
    }

    .header li {
        display: inline-block;
        height: 50px;
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
