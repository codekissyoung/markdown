import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {
      id: null,
      username: '',
      avatar: '',
      phone: ''
    },
    // 登录状态
    isLoggedIn: false,
    // 购物车
    cart: [],
    // 商品收藏
    favorites: []
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
        avatar: '',
        phone: ''
      }
      state.isLoggedIn = false
    },
    
    // 添加到购物车
    ADD_TO_CART(state, product) {
      const existItem = state.cart.find(item => item.id === product.id)
      if (existItem) {
        existItem.quantity += product.quantity || 1
      } else {
        state.cart.push({
          ...product,
          quantity: product.quantity || 1
        })
      }
    },
    
    // 从购物车移除
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId)
    },
    
    // 更新购物车商品数量
    UPDATE_CART_QUANTITY(state, { productId, quantity }) {
      const item = state.cart.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    
    // 清空购物车
    CLEAR_CART(state) {
      state.cart = []
    },
    
    // 添加/移除收藏
    TOGGLE_FAVORITE(state, product) {
      const index = state.favorites.findIndex(item => item.id === product.id)
      if (index > -1) {
        state.favorites.splice(index, 1)
      } else {
        state.favorites.push(product)
      }
    }
  },
  
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 这里应该调用登录API
        commit('SET_USER_INFO', userInfo)
        localStorage.setItem('user_token', 'mock_token_123')
        resolve(userInfo)
      })
    },
    
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_USER_INFO')
      commit('CLEAR_CART')
      localStorage.removeItem('user_token')
    },
    
    // 添加到购物车
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product)
    }
  },
  
  getters: {
    // 购物车商品总数
    cartCount: state => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
    
    // 购物车总价
    cartTotal: state => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    
    // 是否已收藏
    isFavorite: state => productId => {
      return state.favorites.some(item => item.id === productId)
    }
  }
})