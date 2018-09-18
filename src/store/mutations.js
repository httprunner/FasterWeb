export default {
    changeBackButton(state) {
        state.backButton = !state.backButton;
    },

    changeItemUrl(state, value) {
        state.itemUrl = value;
    },

    changeSideMenu(state, value) {
        if (value === 'projectList') {
            state.side_menu = [
                {name: "项目列表",  code: "&#xe888;", url:'ProjectList'},
                {name: "数据库管理",  code: "&#xe64c;", url:'DataBase'}
            ]
        } else {
            state.side_menu = [
                {name: "项目概况", url: "ProjectDetail", code: "&#xe609;"},
                {name: "驱动代码", url: "DebugTalk", code: "&#xe664;"},
                {name: "API 模板", url: "RecordApi", code: "&#xe888;"},
                {name: "自动化测试", url: "AutoTest", code: "&#xe606;"},
                {name: "环境管理", url: "RecordConfig", code: "&#xe673;"}
            ];
        }
    },

}
