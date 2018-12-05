<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html {
  height: 100%;
}
body {
  visibility: visible;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #fff;
  color: #333;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 3px;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #d6dde4;
}

</style>
