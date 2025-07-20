<template>
  <div class="orders-page">
    <div class="page-header">
      <h3>订单管理</h3>
    </div>
    
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="id" label="订单号" width="150"></el-table-column>
      <el-table-column prop="customer" label="客户"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="warning" @click="handleProcess(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      orders: [
        { id: 'ORD001', customer: '张三', amount: '¥299.00', status: '已完成', createTime: '2024-01-20 10:30' },
        { id: 'ORD002', customer: '李四', amount: '¥156.50', status: '处理中', createTime: '2024-01-20 14:20' },
        { id: 'ORD003', customer: '王五', amount: '¥89.90', status: '已取消', createTime: '2024-01-19 16:45' }
      ]
    }
  },
  methods: {
    getStatusType(status) {
      const typeMap = {
        '已完成': 'success',
        '处理中': 'warning', 
        '已取消': 'danger'
      }
      return typeMap[status] || 'info'
    },
    handleView(row) {
      this.$message.info(`查看订单: ${row.id}`)
    },
    handleProcess(row) {
      this.$message.info(`处理订单: ${row.id}`)
    }
  }
}
</script>

<style scoped>
.orders-page {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h3 {
  margin: 0;
  color: #333;
}
</style>