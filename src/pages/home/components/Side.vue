<template>
    <div class="common-side-bar">
        <ul class="nav-side">
            <li v-if="$store.state.backButton"
                class="item-li item-back"
                @click="handleProjectList">
                <span class="iconfont" >&#xe68c;</span>返 回 列 表</li>

            <li v-for="item of $store.state.side_menu"
                :key="item.url"
                :class="{'item-li': true, 'active': $store.state.itemUrl === item.url}"
                @click="selected(item.url)"
            >
                <span class="iconfont" v-html="item.code"></span>
                {{item.name}}
            </li>
        </ul>
    </div>

</template>

<script>
    export default {
        name: "Side",
        methods: {
            handleProjectList() {
                this.$store.commit('changeItemUrl', 'ProjectList');
                this.$store.commit('changeBackButton');
                this.$store.commit('changeSearchButton');
                this.$store.commit('changeSideMenu','projectList');
                this.$router.push({name:'ProjectList'});
            },
            selected(url) {
                this.$store.commit('changeItemUrl', url);
                this.$router.push({name:url})
            }
        }
    }
</script>

<style scoped>
    .common-side-bar {
        border-right: 1px solid #ddd;
        height: 100%;
        background-color: #fff;
        display: inline-block;
    }

    .nav-side {
        display: inline-block;
        padding: 0;
        margin: 0;
        min-height: 690px;
    }

    ul li {
        list-style: none;
    }

    .nav-side li span {
        padding-left: 15px;
        padding-right: 20px;
    }

    .nav-side li:hover {
        color: #43a047;
        background: #ECF8EE;
    }

    .active {
        color: #43a047;
        background: #ECF8EE;
    }


    .item-back {
        border-bottom: 1px solid #ddd;
        font-size: 14px;
        color: dimgray;
    }

    .item-li {
        height: 50px;
        line-height: 50px;
        width: 180px;
        cursor: pointer;

    }
</style>
