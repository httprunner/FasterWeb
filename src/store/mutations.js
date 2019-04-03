export default {

    isLogin(state, value) {
        state.token = value;
    },

    setUser(state, value) {
        state.user = value;
    },
    setRouterName(state, value) {
        state.routerName = value
    }
}
