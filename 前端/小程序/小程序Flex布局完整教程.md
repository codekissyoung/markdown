# 小程序Flex布局完整教程

## 概述

Flexbox（弹性布局）是微信小程序中最重要、最常用的布局方式。它能让容器中的子元素自动适应不同屏幕尺寸，完美解决移动端适配问题。

## 1. Flex基础概念

### 主轴和交叉轴
```
主轴（main axis）: flex-direction决定的方向
交叉轴（cross axis）: 垂直于主轴的方向

默认方向：主轴从左到右，交叉轴从上到下
```

### 核心属性速览
- **容器属性**: display, flex-direction, justify-content, align-items, flex-wrap
- **子元素属性**: flex, align-self, order

## 2. 小程序Flex基础语法

### 2.1 容器设置
```css
/* 最基础的flex容器 */
.container {
  display: flex;  /* 关键：开启flex布局 */
}

/* 垂直方向flex容器 */
.column-container {
  display: flex;
  flex-direction: column;  /* 改变主轴方向 */
}
```

### 2.2 主轴对齐（justify-content）
```css
/* 5种主轴对齐方式 */
/* 1. 左对齐（默认） */
.left-align {
  justify-content: flex-start;
}

/* 2. 右对齐 */
.right-align {
  justify-content: flex-end;
}

/* 3. 居中对齐 */
.center-align {
  justify-content: center;
}

/* 4. 两端对齐，中间等间距 */
.between-align {
  justify-content: space-between;
}

/* 5. 周围等间距 */
.around-align {
  justify-content: space-around;
}
```

### 2.3 交叉轴对齐（align-items）
```css
/* 5种交叉轴对齐方式 */
/* 1. 顶部对齐 */
.top-align {
  align-items: flex-start;
}

/* 2. 底部对齐 */
.bottom-align {
  align-items: flex-end;
}

/* 3. 居中对齐 */
.center-align {
  align-items: center;
}

/* 4. 拉伸填满 */
.stretch-align {
  align-items: stretch;
}

/* 5. 基线对齐 */
.baseline-align {
  align-items: baseline;
}
```

## 3. 小程序实战案例

### 3.1 经典顶部导航栏
```xml
<!-- pages/index/index.wxml -->
<view class="navbar">
  <view class="nav-left">
    <icon type="search" size="20" color="#666"/>
  </view>
  <view class="nav-title">首页</view>
  <view class="nav-right">
    <icon type="more" size="20" color="#666"/>
  </view>
</view>
```

```css
/* pages/index/index.wxss */
.navbar {
  display: flex;
  justify-content: space-between;  /* 左右两端对齐 */
  align-items: center;            /* 垂直居中 */
  height: 88rpx;                  /* 标准导航栏高度 */
  padding: 0 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-left, .nav-right {
  width: 60rpx;                   /* 给左右固定宽度 */
  display: flex;
  justify-content: center;
}

.nav-title {
  flex: 1;                        /* 占据剩余空间 */
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
}
```

### 3.2 完美居中布局
```xml
<view class="center-container">
  <view class="center-content">
    <image src="/images/logo.png" mode="aspectFit"/>
    <text>欢迎使用小程序</text>
    <button>开始使用</button>
  </view>
</view>
```

```css
.center-container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 100vh;            /* 占满整个屏幕 */
  background: #f5f5f5;
}

.center-content {
  display: flex;
  flex-direction: column;   /* 垂直排列 */
  align-items: center;      /* 子元素水平居中 */
  gap: 40rpx;               /* 子元素间距 */
}
```

### 3.3 商品卡片网格布局
```xml
<view class="product-grid">
  <view class="product-card" wx:for="{{products}}" wx:key="id">
    <image class="product-image" src="{{item.image}}" mode="aspectFill"/>
    <view class="product-info">
      <text class="product-name">{{item.name}}</text>
      <view class="price-row">
        <text class="price">¥{{item.price}}</text>
        <text class="original-price">¥{{item.originalPrice}}</text>
      </view>
    </view>
  </view>
</view>
```

```css
.product-grid {
  display: flex;
  flex-wrap: wrap;          /* 允许换行 */
  gap: 20rpx;               /* 网格间距 */
  padding: 30rpx;
}

.product-card {
  flex: 1 1 340rpx;         /* 弹性宽度：可增长 可收缩 基础宽度340rpx */
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.product-image {
  width: 100%;
  height: 200rpx;
}

.product-info {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  /* 处理文字过长 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;   /* 价格对齐基线 */
  gap: 16rpx;
}

.price {
  font-size: 32rpx;
  color: #ff4757;
  font-weight: bold;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}
```

### 3.4 底部固定按钮组
```xml
<view class="bottom-bar">
  <button class="btn-secondary" bindtap="onCancel">取消</button>
  <button class="btn-primary" bindtap="onConfirm">确定</button>
</view>
```

```css
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;               /* 按钮间距 */
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: white;
  border-top: 1rpx solid #eee;
}

.bottom-bar button {
  flex: 1;                  /* 按钮等宽 */
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### 3.5 表单布局
```xml
<view class="form-container">
  <view class="form-item">
    <text class="form-label">用户名</text>
    <input class="form-input" placeholder="请输入用户名"/>
  </view>
  <view class="form-item">
    <text class="form-label">手机号</text>
    <input class="form-input" placeholder="请输入手机号" type="number"/>
  </view>
  <view class="form-item">
    <text class="form-label">验证码</text>
    <input class="form-input" placeholder="请输入验证码" type="number"/>
    <button class="code-btn" size="mini">获取验证码</button>
  </view>
</view>
```

```css
.form-container {
  padding: 30rpx;
}

.form-item {
  display: flex;
  align-items: center;      /* 垂直居中对齐 */
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-label {
  width: 160rpx;            /* 固定标签宽度 */
  font-size: 32rpx;
  color: #333;
}

.form-input {
  flex: 1;                  /* 输入框占据剩余空间 */
  margin-left: 30rpx;
  height: 80rpx;
  font-size: 32rpx;
}

.code-btn {
  margin-left: 20rpx;
  padding: 0 24rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
}
```

## 4. 高级Flex技巧

### 4.1 响应式布局
```css
/* 根据屏幕宽度调整布局 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.product-card {
  flex: 1 1 300rpx;  /* 小屏显示1列，中屏2列，大屏3列 */
}

/* 媒体查询调整 */
@media (min-width: 400px) {
  .product-card {
    flex: 1 1 280rpx;
  }
}
```

### 4.2 子元素特殊对齐
```xml
<view class="special-align">
  <view class="item">默认对齐</view>
  <view class="item special">顶部对齐</view>
  <view class="item">默认对齐</view>
</view>
```

```css
.special-align {
  display: flex;
  align-items: center;     /* 容器默认居中对齐 */
  height: 200rpx;
}

.special {
  align-self: flex-start;  /* 单独设置顶部对齐 */
  background: #ff4757;
  color: white;
}
```

### 4.3 元素排序控制
```css
.flex-container {
  display: flex;
}

.item-1 { order: 2; }  /* 第二个显示 */
.item-2 { order: 3; }  /* 第三个显示 */
.item-3 { order: 1; }  /* 第一个显示 */
```

## 5. 小程序Flex最佳实践

### 5.1 常用工具类
```css
/* flex方向 */
.flex-row { display: flex; }
.flex-column { display: flex; flex-direction: column; }

/* 主轴对齐 */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

/* 交叉轴对齐 */
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

/* 组合工具类 */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### 5.2 性能优化技巧
```css
/* 1. 避免过度嵌套flex */
/* ❌ 不推荐 */
.outer { display: flex; }
.middle { display: flex; }
.inner { display: flex; }

/* ✅ 推荐 */
.container { display: flex; }
.item { /* 直接使用margin、padding调整 */ }

/* 2. 合理使用flex属性 */
/* ❌ 不推荐：可能导致性能问题 */
.item {
  flex: 1 1 auto;  /* auto可能触发复杂计算 */
}

/* ✅ 推荐：明确指定值 */
.item {
  flex: 1 1 0%;   /* 或明确的基础宽度 */
}
```

### 5.3 调试技巧
```css
/* flex调试辅助类 */
.debug-flex {
  border: 2rpx solid red;
}

.debug-flex > view {
  border: 1rpx solid blue;
  margin: 4rpx;
  padding: 8rpx;
  background: rgba(0, 255, 0, 0.1);
}

/* 使用方法 */
.container {
  display: flex;
  /* debug-flex; 调试时取消注释 */
}
```

## 6. 常见问题与解决方案

### 6.1 子元素宽度不生效
```css
/* 问题：设置width无效 */
.item {
  width: 200rpx;  /* ❌ 在flex容器中可能不生效 */
}

/* 解决：使用flex-basis */
.item {
  flex: 0 0 200rpx;  /* ✅ 固定宽度200rpx */
}

/* 或使用min-width */
.item {
  min-width: 200rpx;  /* ✅ 最小宽度200rpx */
}
```

### 6.2 文字溢出处理
```css
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行文字省略 */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 6.3 不等高卡片对齐
```css
/* 问题：卡片高度不一致导致对齐问题 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
}

/* 解决：使用align-items控制对齐 */
.card-grid {
  align-items: flex-start;  /* 顶部对齐 */
  /* 或 align-items: stretch; 拉伸等高 */
}
```

## 7. 小程序Flex布局检查清单

### 布局前检查
- [ ] 确定主轴方向（水平/垂直）
- [ ] 确定对齐方式（主轴/交叉轴）
- [ ] 考虑是否需要换行（flex-wrap）
- [ ] 设置合适的间距（gap/margin）

### 响应式检查
- [ ] 在不同屏幕尺寸下测试
- [ ] 检查rpx单位换算是否正确
- [ ] 验证flex: 1 1 width的响应式效果

### 交互检查
- [ ] 按钮触摸区域是否足够大（最小88rpx）
- [ ] 表单元素对齐是否正确
- [ ] 滚动区域是否合理

### 性能检查
- [ ] 避免过深的flex嵌套
- [ ] 检查是否使用了合理的flex属性值
- [ ] 优化动画和过渡效果

## 总结

Flexbox是小程序开发的必备技能，掌握以下核心要点：

1. **主轴控制**: justify-content控制水平方向对齐
2. **交叉轴控制**: align-items控制垂直方向对齐
3. **弹性尺寸**: flex属性实现自适应宽度
4. **换行控制**: flex-wrap处理多行布局
5. **响应式**: 配合rpx单位实现完美适配

通过合理使用Flex布局，可以轻松构建出美观、响应式的小程序界面。