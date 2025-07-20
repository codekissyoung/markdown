<template>
  <div class="products-page">
    <div class="page-header">
      <h3>商品管理</h3>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 添加商品
      </el-button>
    </div>
    
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="id" label="商品ID" width="100"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      products: [
        { id: 1, name: 'iPhone 15', price: '¥5999', stock: 100, category: '手机' },
        { id: 2, name: 'MacBook Pro', price: '¥12999', stock: 50, category: '电脑' }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.$message.info('添加商品功能开发中...')
    },
    handleEdit(row) {
      this.$message.info(`编辑商品: ${row.name}`)
    },
    handleDelete(row) {
      this.$message.info(`删除商品: ${row.name}`)
    }
  }
}
</script>

<style scoped>
.products-page {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h3 {
  margin: 0;
  color: #333;
}
</style>