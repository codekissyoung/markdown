<template>
  <div class="profile-page">
    <van-nav-bar title="我的" />
    
    <div class="user-info">
      <van-image round width="60" height="60" :src="userInfo.avatar" />
      <div class="user-detail">
        <h3>{{ userInfo.username }}</h3>
        <p>{{ userInfo.phone }}</p>
      </div>
    </div>
    
    <van-cell-group>
      <van-cell title="我的订单" is-link />
      <van-cell title="收藏夹" is-link />
      <van-cell title="地址管理" is-link />
      <van-cell title="设置" is-link />
    </van-cell-group>
    
    <div class="logout-btn">
      <van-button block type="danger" @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['logout']),
    
    handleLogout() {
      this.$dialog.confirm({
        message: '确定要退出登录吗？'
      }).then(() => {
        this.logout()
        this.$router.push('/home')
        this.$toast.success('退出成功')
      })
    }
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  margin-bottom: 10px;
}

.user-detail {
  margin-left: 15px;
}

.user-detail h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.user-detail p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.logout-btn {
  margin: 30px 15px;
}
</style>