<!--顶部数据统计-->
<script setup lang="ts">
import { DataBoard, Document, Notebook } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useTodoStore } from '@/store/todo.ts'
import { usePlanStore } from '@/store/plan.ts'
import { useRouter } from 'vue-router' // 新增导入

const router = useRouter() // 新增路由实例
const todoStore = useTodoStore()
const planStore = usePlanStore()

// 统计全部未完成的待办和学习计划的数量
const allUncompletedTodoCount = computed(
  () => todoStore.todoList.filter((t) => !t.isCompleted).length,
)
const allUncompletedPlanCount = computed(
  () => Array.from(planStore.planMap.values()).filter((p) => !p.isCompleted).length,
)
</script>
<template>
  <el-row :gutter="20" class="stats-row">
    <el-col :span="8" @click="router.push('/todo')">
      <el-tooltip content="点击查看待办事项" placement="top" :show-after="100" effect="light">
        <el-card class="stat-card">
          <div class="card-content">
            <el-icon class="card-icon">
              <Document />
            </el-icon>
            <div class="card-text">
              <div class="card-value">{{ allUncompletedTodoCount }}</div>
              <div class="card-title">未完成待办</div>
            </div>
          </div>
        </el-card>
      </el-tooltip>
    </el-col>
    <el-col :span="8" @click="router.push('/study/plan')">
      <el-tooltip content="点击查看学习计划" placement="top" :show-after="100" effect="light">
        <el-card class="stat-card">
          <div class="card-content">
            <el-icon class="card-icon">
              <Notebook />
            </el-icon>
            <div class="card-text">
              <div class="card-value">{{ allUncompletedPlanCount }}</div>
              <div class="card-title">未完成计划</div>
            </div>
          </div>
        </el-card>
      </el-tooltip>
    </el-col>
    <el-col :span="8" @click="router.push('/course')">
      <el-tooltip content="点击查看课程课表" placement="top" :show-after="100" effect="light">
        <el-card class="stat-card">
          <div class="card-content">
            <el-icon class="card-icon">
              <DataBoard />
            </el-icon>
            <div class="card-text">
              <div class="card-value">0</div>
              <div class="card-title">本周剩余课程</div>
            </div>
          </div>
        </el-card>
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.stats-row {
  margin-bottom: 20px;
  .el-col {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateY(-5px);
      .stat-card {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: linear-gradient(
          to bottom right,
          rgba(64, 158, 255, 0.05),
          rgba(64, 158, 255, 0.02)
        );
      }
    }
  }
}

.stat-card {
  margin-bottom: 20px;
  // 原有样式基础上增加过渡效果
  transition:
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease;
  .card-content {
    display: flex;
    align-items: center;
    padding: 15px;
  }
  .card-icon {
    font-size: 32px;
    color: #409eff;
    margin-right: 15px;
  }
}

.card-text {
  user-select: none;
  .card-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }

  .card-title {
    color: #909399;
    font-size: 14px;
  }
}
</style>
