<script setup lang="ts">
import { Document, Refresh, Search } from '@element-plus/icons-vue'

</script>
<template>
  <div class="wrapper">
    <!-- 中心标题 -->
    <div class="center-section">
      <h1 class="title">
        <el-icon class="title-icon"><document /></el-icon>
        <span class="title-text">学习过程管理</span>
        <span class="title-decoration"></span>
      </h1>
    </div>
    <!-- 查询操作 -->
    <div class="search-section">
      <el-input placeholder="请输入过程内容查询" :prefix-icon="Search" />
      <el-button :icon="Search" plain>查询</el-button>
      <el-button :icon="Refresh" type="info" plain>重置</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    position: relative;
    margin: 0;
    font-size: 20px;
    color: #303133;
    display: flex;
    align-items: center;
    &-icon {
      margin-right: 12px;
      color: #409eff;
      font-size: 28px;
      filter: drop-shadow(0 2px 4px rgba(64, 158, 255, 0.2));
    }
    &-text {
      position: relative;
      font-weight: 600;
      background: linear-gradient(135deg, #303133 60%, #409eff);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    &-decoration {
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #409eff33, #409eff);
    }
  }
  .search-section {
    display: flex;
    align-items: center;
    gap: 10px;
    :deep(.el-input) {
      width: 240px;
      margin-right: 14px;
    }
    .el-button {
      transition: all 0.3s ease;
      border-radius: 8px;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      }
    }
  }
  .new-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #409eff, #3375ff);
    border: none;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
