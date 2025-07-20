<template>
  <div class="product-detail">
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" />
    
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in product.images" :key="index">
        <img :src="image" :alt="product.name" />
      </van-swipe-item>
    </van-swipe>
    
    <div class="product-info">
      <h2>{{ product.name }}</h2>
      <p class="price">¥{{ product.price }}</p>
      <p class="description">{{ product.description }}</p>
    </div>
    
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" />
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartCount" @click="goToCart" />
      <van-goods-action-icon icon="star-o" text="收藏" :color="isFavorite(product.id) ? '#ff5000' : ''" @click="toggleFavorite" />
      <van-goods-action-button type="warning" text="加入购物车" @click="addToCart" />
      <van-goods-action-button type="danger" text="立即购买" @click="buyNow" />
    </van-goods-action>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {
        id: 1,
        name: 'iPhone 15',
        price: 5999,
        description: '全新iPhone 15，搭载A17芝片，支持USB-C接口。',
        images: [
          'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
          'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['cartCount', 'isFavorite'])
  },
  methods: {
    ...mapActions(['addToCart']),
    
    goBack() {
      this.$router.go(-1)
    },
    
    goToCart() {
      this.$router.push('/cart')
    },
    
    addToCart() {
      this.addToCart(this.product)
      this.$toast('已添加到购物车')
    },
    
    buyNow() {
      this.$toast('立即购买功能开发中...')
    },
    
    toggleFavorite() {
      this.$store.commit('TOGGLE_FAVORITE', this.product)
      this.$toast(this.isFavorite(this.product.id) ? '已收藏' : '取消收藏')
    }
  },
  mounted() {
    // 根据路由参数加载商品详情
    const productId = this.$route.params.id
    console.log('加载商品ID:', productId)
  }
}
</script>

<style scoped>
.van-swipe {
  height: 300px;
}

.van-swipe img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  background: white;
}

.product-info h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.price {
  font-size: 20px;
  color: #ff6b35;
  font-weight: bold;
  margin: 10px 0;
}

.description {
  color: #666;
  line-height: 1.5;
}
</style>