<script setup lang="ts">
import { computed } from 'vue'
import { usePlanStore } from '@/store/plan'
import TodoCard from '@/views/home/components/TodoCard.vue'
import PlanCard from '@/views/home/components/PlanCard.vue'
import DashboardStats from '@/views/home/components/DashboardStats.vue'
import CourseCard from '@/views/home/components/CourseCard.vue'

const planStore = usePlanStore()

const todayPlans = computed(() => planStore.todayAllPlans)
</script>

<template>
  <div class="home-container">
    <!-- 顶部统计 -->
    <dashboard-stats></dashboard-stats>
    <el-row :gutter="20">
      <el-col :span="8">
        <todo-card></todo-card>
      </el-col>
      <el-col :span="8">
        <plan-card :plans="todayPlans"></plan-card>
      </el-col>
      <el-col :span="8">
        <course-card></course-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header i {
  margin-right: 8px;
  font-size: 18px;
}

.my-card {
  height: 400px;
  overflow: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    background: #f8f9fa;
    border-radius: 8px;

    span:first-child {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }

    .progress {
      color: #409eff;
      font-weight: 500;
    }
  }
}
</style>
