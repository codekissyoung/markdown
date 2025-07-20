<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" />
    
    <div v-if="cart.length === 0" class="empty-cart">
      <van-empty description="购物车为空" />
      <van-button type="primary" @click="goShopping">去购物</van-button>
    </div>
    
    <div v-else>
      <van-checkbox-group v-model="checkedItems">
        <van-swipe-cell v-for="item in cart" :key="item.id">
          <div class="cart-item">
            <van-checkbox :name="item.id" />
            <img :src="item.image" :alt="item.name" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="price">¥{{ item.price }}</p>
            </div>
            <van-stepper v-model="item.quantity" @change="updateQuantity(item.id, $event)" />
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="removeItem(item.id)" />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
      
      <van-submit-bar
        :price="totalPrice * 100"
        button-text="立即结算"
        @submit="checkout"
      >
        <van-checkbox v-model="selectAll" @change="onSelectAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Cart',
  data() {
    return {
      checkedItems: [],
      selectAll: false
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal']),
    
    totalPrice() {
      return this.cart
        .filter(item => this.checkedItems.includes(item.id))
        .reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  methods: {
    updateQuantity(productId, quantity) {
      this.$store.commit('UPDATE_CART_QUANTITY', { productId, quantity })
    },
    
    removeItem(productId) {
      this.$store.commit('REMOVE_FROM_CART', productId)
    },
    
    onSelectAll(checked) {
      this.checkedItems = checked ? this.cart.map(item => item.id) : []
    },
    
    checkout() {
      if (this.checkedItems.length === 0) {
        this.$toast('请选择商品')
        return
      }
      this.$toast('结算功能开发中...')
    },
    
    goShopping() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.empty-cart {
  text-align: center;
  padding: 50px 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
}

.cart-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 0 15px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.price {
  color: #ff6b35;
  font-weight: bold;
  margin: 0;
}
</style>