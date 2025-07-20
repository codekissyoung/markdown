<template>
  <div class="login-page">
    <div class="login-header">
      <van-nav-bar title="用户登录" left-arrow @click-left="goBack" />
    </div>
    
    <div class="login-content">
      <div class="logo">
        <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="Logo" />
        <h2>欢迎登录</h2>
      </div>
      
      <van-form @submit="handleLogin">
        <van-field
          v-model="loginForm.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        
        <van-field
          v-model="loginForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        
        <div class="login-btn">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </van-button>
        </div>
      </van-form>
      
      <div class="login-tips">
        <p>测试账号：13800138000 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        phone: '13800138000',
        password: '123456'
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    
    async handleLogin() {
      this.loading = true
      
      try {
        await this.login({
          username: this.loginForm.phone,
          phone: this.loginForm.phone,
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
        })
        
        this.$toast.success('登录成功')
        
        // 跳转到之前的页面或首页
        const redirect = this.$route.query.redirect || '/home'
        this.$router.replace(redirect)
        
      } catch (error) {
        this.$toast.fail('登录失败')
      } finally {
        this.loading = false
      }
    },
    
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.login-content {
  padding: 40px 20px;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.logo h2 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.login-btn {
  margin: 30px 0;
}

.login-tips {
  text-align: center;
  margin-top: 20px;
}

.login-tips p {
  color: #999;
  font-size: 14px;
}
</style>