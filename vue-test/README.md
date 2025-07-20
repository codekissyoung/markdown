# Vue 2.6 项目 - Admin后台 + H5移动端

## 项目概述

这是一个完整的Vue 2.6前端项目，包含：
- **Admin后台管理系统** - 使用Element UI
- **H5移动端商城** - 使用Vant 2

## 技术栈

### 共同技术栈
- Vue 2.6.14
- Vue Router 3
- Vuex 3
- Axios

### Admin后台
- Element UI 2.15.14
- 响应式管理界面
- 用户、商品、订单管理

### H5移动端
- Vant 2.12.54
- 移动端优化
- 商城购物功能

## 项目结构

```
vue-test/
├── admin/          # Admin后台项目
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── router/     # 路由配置
│   │   ├── store/      # Vuex状态管理
│   │   ├── utils/      # 工具函数
│   │   └── main.js     # 入口文件
│   ├── public/
│   └── package.json
├── h5/             # H5移动端项目  
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── router/     # 路由配置
│   │   ├── store/      # Vuex状态管理
│   │   ├── utils/      # 工具函数
│   │   └── main.js     # 入口文件
│   ├── public/
│   └── package.json
└── README.md       # 项目说明
```

## 快速开始

### 环境要求
- Node.js >= 14
- npm >= 6

### 安装依赖

#### Admin后台
```bash
cd admin
npm install
```

#### H5移动端
```bash
cd h5
npm install
```

### 开发运行

#### Admin后台
```bash
cd admin
npm run serve
# 访问 http://localhost:8080
```

#### H5移动端
```bash
cd h5
npm run serve  
# 访问 http://localhost:8081
```

### 构建部署
```bash
# Admin后台
cd admin && npm run build

# H5移动端
cd h5 && npm run build
```

## 功能特性

### Admin后台功能
- ✅ 用户登录/退出
- ✅ 仪表盘数据展示
- ✅ 用户管理（列表、搜索、操作）
- ✅ 商品管理
- ✅ 订单管理
- ✅ 响应式布局
- ✅ 权限控制

### H5移动端功能
- ✅ 商品首页展示
- ✅ 商品分类浏览
- ✅ 商品详情页
- ✅ 购物车管理
- ✅ 用户登录/个人中心
- ✅ 移动端适配
- ✅ 底部导航

## 核心代码示例

### Vue 2.6 Options API 示例
```javascript
export default {
  name: 'ComponentName',
  data() {
    return {
      message: 'Hello Vue 2.6'
    }
  },
  computed: {
    computedValue() {
      return this.message.toUpperCase()
    }
  },
  methods: {
    handleClick() {
      this.$message.success('操作成功')
    }
  },
  mounted() {
    console.log('组件已挂载')
  }
}
```

### Vuex 状态管理示例
```javascript
// store/index.js
export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    login({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  }
})
```

### Vue Router 路由示例
```javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]
```

## 测试账号

### Admin后台
- 用户名：admin
- 密码：123456

### H5移动端
- 手机号：13800138000
- 密码：123456

## 学习要点

### 1. Vue 2.6 基础
- Options API 语法
- 数据绑定和事件处理
- 组件通信

### 2. Element UI 使用
- 表格组件 (el-table)
- 表单组件 (el-form)
- 导航菜单 (el-menu)
- 布局组件 (el-container)

### 3. Vant 2 使用  
- 移动端组件
- 表单组件 (van-field)
- 列表组件 (van-list)
- 导航栏 (van-nav-bar)

### 4. 路由管理
- 路由配置
- 导航守卫
- 权限控制

### 5. 状态管理
- Vuex store结构
- mutations/actions
- getters计算属性

## 常见问题

### Q: 如何添加新页面？
A: 
1. 在views/目录创建新组件
2. 在router/index.js添加路由配置
3. 在导航菜单中添加链接

### Q: 如何调用API？
A: 使用封装好的axios实例：
```javascript
this.$http.get('/api/users').then(res => {
  console.log(res.data)
})
```

### Q: 如何添加新的Vuex状态？
A:
1. 在state中定义状态
2. 添加对应的mutations
3. 在组件中使用mapState/mapMutations

## 下一步学习计划

1. **深入Element UI** - 学习更多组件用法
2. **深入Vant 2** - 掌握移动端特有组件
3. **API集成** - 对接真实后端接口
4. **性能优化** - 代码分割、懒加载
5. **测试** - 单元测试和集成测试

## 参考资料

- [Vue 2.6 官方文档](https://cn.vuejs.org/)
- [Element UI 文档](https://element.eleme.cn/)
- [Vant 2 文档](https://vant-contrib.gitee.io/vant/v2/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Vuex 文档](https://vuex.vuejs.org/zh/)

---

**开始学习时间**: ___________  
**项目完成时间**: ___________  
**遇到的问题记录**: ___________