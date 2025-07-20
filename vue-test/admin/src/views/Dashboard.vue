<template>
  <div class="dashboard">
    <!-- 布局容器 -->
    <el-container style="height: 100vh">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h3>Admin后台</h3>
        </div>
        
        <el-menu
          :default-active="$route.path"
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-s-home"></i>
            <span>仪表盘</span>
          </el-menu-item>
          
          <el-menu-item index="/users">
            <i class="el-icon-user-solid"></i>
            <span>用户管理</span>
          </el-menu-item>
          
          <el-menu-item index="/products">
            <i class="el-icon-goods"></i>
            <span>商品管理</span>
          </el-menu-item>
          
          <el-menu-item index="/orders">
            <i class="el-icon-s-order"></i>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主体区域 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <h4>{{ $route.meta.title || '仪表盘' }}</h4>
          </div>
          
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :src="avatar" size="small"></el-avatar>
                <span class="username">{{ username }}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 主要内容区 -->
        <el-main class="main-content">
          <!-- 数据统计卡片 -->
          <el-row :gutter="20" class="stats-row">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-icon user-icon">
                  <i class="el-icon-user-solid"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">1,234</div>
                  <div class="stat-label">用户总数</div>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-icon product-icon">
                  <i class="el-icon-goods"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">567</div>
                  <div class="stat-label">商品总数</div>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-icon order-icon">
                  <i class="el-icon-s-order"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">890</div>
                  <div class="stat-label">订单总数</div>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-icon money-icon">
                  <i class="el-icon-coin"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">¥12,345</div>
                  <div class="stat-label">总收入</div>
                </div>
              </div>
            </el-col>
          </el-row>
          
          <!-- 表格区域 -->
          <div class="table-container">
            <h4>最新订单</h4>
            <el-table :data="recentOrders" style="width: 100%">
              <el-table-column prop="id" label="订单号" width="180"></el-table-column>
              <el-table-column prop="customer" label="客户"></el-table-column>
              <el-table-column prop="amount" label="金额"></el-table-column>
              <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="日期"></el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      recentOrders: [
        {
          id: 'ORD001',
          customer: '张三',
          amount: '¥299.00',
          status: '已完成',
          date: '2024-01-20'
        },
        {
          id: 'ORD002',
          customer: '李四',
          amount: '¥156.50',
          status: '处理中',
          date: '2024-01-20'
        },
        {
          id: 'ORD003',
          customer: '王五',
          amount: '¥89.90',
          status: '已取消',
          date: '2024-01-19'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['username', 'avatar'])
  },
  methods: {
    ...mapActions(['logout']),
    
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout()
          this.$router.push('/login')
          this.$message.success('退出成功')
        })
      } else if (command === 'profile') {
        this.$message.info('个人中心功能开发中...')
      }
    },
    
    getStatusType(status) {
      const typeMap = {
        '已完成': 'success',
        '处理中': 'warning',
        '已取消': 'danger'
      }
      return typeMap[status] || 'info'
    }
  },
  mounted() {
    // 获取用户信息
    this.$store.dispatch('getUserInfo')
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #304156;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3643;
  color: white;
  margin-bottom: 0;
}

.sidebar-menu {
  border: none;
}

.header {
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left h4 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.username {
  margin: 0 8px;
  color: #333;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.user-icon { background: #409EFF; }
.product-icon { background: #67C23A; }
.order-icon { background: #E6A23C; }
.money-icon { background: #F56C6C; }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  color: #999;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-container h4 {
  margin: 0 0 20px 0;
  color: #333;
}
</style>