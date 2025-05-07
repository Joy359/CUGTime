<script setup lang="ts">
import type { PlanItem } from '@/types/plan'
import { computed } from 'vue'
import { usePlanStore } from '@/store/plan.ts'
import { dayjs } from 'element-plus'

const props = defineProps<{
  plans: PlanItem[]
}>()

const planStore = usePlanStore()
// 拆分未完成/已完成
const uncompletedPlans = computed(() => props.plans.filter((p) => !p.isCompleted))
const completedPlans = computed(() => props.plans.filter((p) => p.isCompleted))
const todayPlans = computed(() => planStore.todayAllPlans)
// 获取今日全部计划
console.log(planStore.todayAllPlans)
</script>
<template>
  <el-card class="my-card">
    <template #header>
      <div class="card-header">
        <span>今日学习计划</span>
        <span class="progress">（共 {{ todayPlans.length }} 项）</span>
      </div>
    </template>
    <div v-if="plans.length">
      <!-- 未完成部分 -->
      <div v-for="plan in uncompletedPlans" :key="plan.id" class="plan-item uncompleted">
        <!-- 显示内容 -->
      </div>

      <!-- 已完成分隔线 -->
      <div v-if="completedPlans.length" class="completed-divider">
        <el-divider>已完成计划</el-divider>
      </div>

      <!-- 已完成部分 -->
      <div v-for="plan in completedPlans" :key="plan.id" class="plan-item completed">
        <!-- 显示内容 -->
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.plan-list {
  padding: 10px;
  height: 400px;
}

.plan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.plan-item:last-child {
  border-bottom: none;
}

.plan-info {
  display: flex;
  align-items: center;
}

.plan-details {
  margin-left: 10px;
}

.plan-title {
  font-size: 14px;
  color: #303133;
}

.plan-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.plan-progress {
  width: 200px;
}
</style>
