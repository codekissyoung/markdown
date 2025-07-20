<template>
  <div class="home">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchKeyword"
      placeholder="搜索商品"
      @search="handleSearch"
    />
    
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(banner, index) in banners" :key="index">
        <img :src="banner.image" :alt="banner.title" />
      </van-swipe-item>
    </van-swipe>
    
    <!-- 分类导航 -->
    <div class="category-nav">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        @click="goToCategory(category)"
      >
        <img :src="category.icon" :alt="category.name" />
        <span>{{ category.name }}</span>
      </div>
    </div>
    
    <!-- 热门商品 -->
    <div class="section">
      <div class="section-title">
        <h3>热门商品</h3>
        <span @click="viewMore">更多 ></span>
      </div>
      
      <div class="product-grid">
        <div 
          v-for="product in hotProducts" 
          :key="product.id"
          class="product-card"
          @click="goToProduct(product.id)"
        >
          <img :src="product.image" :alt="product.name" />
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
            <van-button 
              size="mini" 
              type="primary"
              @click.stop="addToCart(product)"
            >
              加入购物车
            </van-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <van-tabbar v-model="activeTab" @change="onTabChange">
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" :badge="cartCount" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      activeTab: 0,
      searchKeyword: '',
      banners: [
        {
          title: '轮播图1',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        },
        {
          title: '轮播图2', 
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        }
      ],
      categories: [
        { id: 1, name: '手机', icon: 'https://img.yzcdn.cn/vant/cat.jpeg' },
        { id: 2, name: '电脑', icon: 'https://img.yzcdn.cn/vant/cat.jpeg' },
        { id: 3, name: '家电', icon: 'https://img.yzcdn.cn/vant/cat.jpeg' },
        { id: 4, name: '服装', icon: 'https://img.yzcdn.cn/vant/cat.jpeg' }
      ],
      hotProducts: [
        {
          id: 1,
          name: 'iPhone 15',
          price: 5999,
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        },
        {
          id: 2,
          name: 'MacBook Pro',
          price: 12999,
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        },
        {
          id: 3,
          name: 'iPad Air',
          price: 3999,
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
        },
        {
          id: 4,
          name: 'AirPods Pro',
          price: 1999,
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['cartCount'])
  },
  methods: {
    ...mapActions(['addToCart']),
    
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$toast(`搜索：${this.searchKeyword}`)
      }
    },
    
    goToCategory(category) {
      this.$router.push(`/category?id=${category.id}`)
    },
    
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    addToCart(product) {
      this.addToCart(product)
      this.$toast('已添加到购物车')
    },
    
    viewMore() {
      this.$router.push('/category')
    },
    
    onTabChange(index) {
      // 处理底部导航切换
      console.log('切换到', index)
    }
  }
}
</script>

<style scoped>
.home {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 50px; /* 为底部导航留空间 */
}

/* 轮播图样式 */
.van-swipe {
  height: 200px;
}

.van-swipe img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  background: white;
  margin-bottom: 10px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

.category-item img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-bottom: 5px;
}

/* 区块样式 */
.section {
  background: white;
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.section-title span {
  font-size: 14px;
  color: #999;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.product-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}

.product-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  margin: 5px 0;
  font-size: 16px;
  color: #ff6b35;
  font-weight: bold;
}

.van-button {
  width: 100%;
}
</style>