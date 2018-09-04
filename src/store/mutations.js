export default {
    changeBackButton(state) {
        state.backButton = !state.backButton;
    },

    changeSearchButton(state) {
        state.searchButton = !state.searchButton;
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
                {name: "debugtalk.py", url: "DebugTalk", code: "&#xe664;"},
                {name: "API Record", url: "RecordApi", code: "&#xe888;"},
                {name: "Test Suite", url: "TestSuite", code: "&#xe697;"},
                {name: "Auto Test", url: "0006", code: "&#xe606;"},
                {name: "环境管理", url: "0007", code: "&#xe673;"},
                {name: "团队成员", url: "0008", code: "&#xe60c;"},
                {name: "返回报文", url: "0009", code: "&#xe609;"}
            ];
        }
    },

}
