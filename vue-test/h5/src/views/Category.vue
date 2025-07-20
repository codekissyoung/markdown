<template>
  <div class="category-page">
    <van-nav-bar title="商品分类" />
    
    <van-sidebar v-model="activeKey">
      <van-sidebar-item v-for="category in categories" :key="category.id" :title="category.name" />
    </van-sidebar>
    
    <div class="content">
      <div class="product-list">
        <div v-for="product in products" :key="product.id" class="product-item" @click="goToProduct(product.id)">
          <img :src="product.image" :alt="product.name" />
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      activeKey: 0,
      categories: [
        { id: 1, name: '手机' },
        { id: 2, name: '电脑' },
        { id: 3, name: '家电' }
      ],
      products: [
        { id: 1, name: 'iPhone 15', price: 5999, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg' },
        { id: 2, name: 'MacBook Pro', price: 12999, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg' }
      ]
    }
  },
  methods: {
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    }
  }
}
</script>

<style scoped>
.category-page {
  display: flex;
  height: calc(100vh - 46px);
}

.content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
}

.product-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.price {
  color: #ff6b35;
  font-weight: bold;
  margin: 0;
}
</style>