export default {

    isLogin(state, value){
        state.token = value;
    },

    setUser(state, value){
        state.user = value;
    },

    changeBackButton(state) {
        state.backButton = !state.backButton;
    },

    changeItemUrl(state, value) {
        state.itemUrl = value;
    },

    changeSideMenu(state, value) {
        if (value === 'projectList') {
            state.side_menu = [
                {name: "接口自动化",  code: "&#xe7a7;", url:'ProjectList'},
                {name: "数据库管理",  code: "&#xe782;", url:'DataBase'}
            ]
        } else {
            state.side_menu = [
                {name: "项目概况", url: "ProjectDetail", code: "&#xe64a;"},
                {name: "驱动代码", url: "DebugTalk", code: "&#xe7ca;"},
                {name: "API 模板", url: "RecordApi", code: "&#xe74a;"},
                {name: "自动化测试", url: "AutoTest", code: "&#xe6da;"},
                {name: "环境管理", url: "RecordConfig", code: "&#xee32;"},
                {name: "定时任务", url: "Task", code: "&#xe61e;"},
                {name: "测试报告", url: "Reports", code: "&#xe66e;"},
                {name: "线上监控", url: "Monitor", code: "&#xe61f;"},
                {name: "MockServer", url: "MockServer", code: "&#xe63c;"}
            ];
        }
    }

}
