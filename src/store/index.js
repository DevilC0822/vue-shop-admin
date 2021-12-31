import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    cookie: '',
    isLogin: false,
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token

      // localStorage.setItem("token", token);
    },
    setCookie(state, cookie) {
      state.cookie = cookie
      // localStorage.setItem("cookie", cookie);
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin
      window.sessionStorage.setItem("isLogin", state.isLogin);
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      window.sessionStorage.setItem("userInfo", state.userInfo);
    },
  },
  actions: {},
  modules: {}
})