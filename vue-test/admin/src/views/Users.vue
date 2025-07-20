<template>
  <div class="users-page">
    <div class="page-header">
      <h3>用户管理</h3>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 添加用户
      </el-button>
    </div>
    
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名:">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 用户表格 -->
    <el-table :data="users" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch 
            v-model="scope.row.status" 
            active-text="启用" 
            inactive-text="禁用"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-area">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      loading: false,
      searchForm: {
        username: '',
        email: ''
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      users: [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          phone: '13800138001',
          status: true,
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          phone: '13800138002',
          status: false,
          createTime: '2024-01-16 14:20:00'
        }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.$message.info('添加用户功能开发中...')
    },
    
    handleEdit(row) {
      this.$message.info(`编辑用户: ${row.username}`)
    },
    
    handleDelete(row) {
      this.$confirm(`确定要删除用户 ${row.username} 吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      })
    },
    
    handleStatusChange(row) {
      this.$message.success(`用户 ${row.username} 状态已${row.status ? '启用' : '禁用'}`)
    },
    
    handleSearch() {
      this.$message.info('搜索功能开发中...')
    },
    
    handleReset() {
      this.searchForm = {
        username: '',
        email: ''
      }
    },
    
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadUsers()
    },
    
    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadUsers()
    },
    
    loadUsers() {
      // 这里应该调用API获取用户数据
      console.log('加载用户数据', this.pagination)
    }
  },
  mounted() {
    this.loadUsers()
  }
}
</script>

<style scoped>
.users-page {
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

.search-area {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.pagination-area {
  margin-top: 20px;
  text-align: right;
}
</style>