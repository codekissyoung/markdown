import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {
      id: null,
      username: '',
      email: '',
      avatar: ''
    },
    // 登录状态
    isLoggedIn: false,
    // 侧边栏折叠状态
    sidebarCollapsed: false,
    // 加载状态
    loading: false
  },
  
  mutations: {
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      state.isLoggedIn = true
    },
    
    // 清除用户信息
    CLEAR_USER_INFO(state) {
      state.userInfo = {
        id: null,
        username: '',
        email: '',
        avatar: ''
      }
      state.isLoggedIn = false
    },
    
    // 切换侧边栏
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    
    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 这里应该调用登录API
        // 模拟登录成功
        commit('SET_USER_INFO', userInfo)
        localStorage.setItem('admin_token', 'mock_token_123')
        resolve(userInfo)
      })
    },
    
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_USER_INFO')
      localStorage.removeItem('admin_token')
    },
    
    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 这里应该调用获取用户信息API
        // 模拟用户信息
        const userInfo = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
        commit('SET_USER_INFO', userInfo)
        resolve(userInfo)
      })
    }
  },
  
  getters: {
    // 是否已登录
    isLoggedIn: state => state.isLoggedIn,
    
    // 用户名
    username: state => state.userInfo.username,
    
    // 用户头像
    avatar: state => state.userInfo.avatar
  }
})