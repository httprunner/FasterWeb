export default {

    isLogin(state, value) {
        state.token = value;
    },

    setUser(state, value) {
        state.user = value;
    },

    changeBackButton(state, value) {
        state.backButton = value
    }
}
