<script setup lang="ts">
import { ref, computed } from 'vue'
import { CircleCheck, Delete, Edit, DocumentRemove } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface ScheduleItem {
  id: number
  time: string
  title: string
  completed: boolean
}

// 日程数据（仅内存存储）
const schedules = ref<ScheduleItem[]>([])

// 对话框状态管理
const dialogVisible = ref(false)
const isEditing = ref(false)
const currentSchedule = ref<Partial<ScheduleItem>>({})

// ID生成器
const idCounter = computed(() => Math.max(0, ...schedules.value.map((item) => item.id)) + 1)

// 打开编辑对话框
const openEditor = (item?: ScheduleItem) => {
  isEditing.value = !!item
  currentSchedule.value = item
    ? { ...item }
    : {
        time: '09:00',
        title: '',
        completed: false,
      }
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  if (!currentSchedule.value.time || !currentSchedule.value.title) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEditing.value) {
    const index = schedules.value.findIndex((i) => i.id === currentSchedule.value.id)
    if (index > -1) {
      schedules.value.splice(index, 1, currentSchedule.value as ScheduleItem)
    }
  } else {
    schedules.value.push({
      ...currentSchedule.value,
      id: idCounter.value,
    } as ScheduleItem)
  }

  dialogVisible.value = false
}

// 删除日程
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定永久删除该日程？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    schedules.value = schedules.value.filter((item) => item.id !== id)
    ElMessage.success('删除成功')
  })
}
</script>

<template>
  <div class="container">
    <el-card class="schedule-card">
      <template #header>
        <div class="card-header">
          <h3>今日日程</h3>
          <el-button type="primary" size="small" @click="openEditor()">+ 新建日程</el-button>
        </div>
      </template>

      <!-- 日程列表 -->
      <el-timeline v-if="schedules.length > 0">
        <el-timeline-item
          v-for="item in schedules"
          :key="item.id"
          :timestamp="item.time"
          :type="item.completed ? 'success' : 'primary'"
          placement="top"
        >
          <div class="schedule-item-wrapper">
            <div :class="['schedule-content', { completed: item.completed }]">
              {{ item.title }}
              <el-icon v-if="item.completed" class="check-icon">
                <CircleCheck />
              </el-icon>
            </div>
            <div class="action-buttons">
              <el-button
                type="primary"
                :icon="Edit"
                circle
                size="small"
                @click="openEditor(item)"
              />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="handleDelete(item.id)"
              />
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-icon :size="40"><DocumentRemove /></el-icon>
        <p>今日暂无日程安排</p>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑日程' : '新建日程'" width="450px">
      <el-form label-width="80px">
        <el-form-item label="时间" required>
          <el-time-picker
            v-model="currentSchedule.time"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input
            v-model="currentSchedule.title"
            placeholder="请输入日程内容"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="currentSchedule.completed"
            active-text="已完成"
            inactive-text="进行中"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.schedule-item-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.schedule-content {
  position: relative;
  flex: 1;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.check-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.action-buttons {
  margin-left: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.el-timeline-item:hover .action-buttons {
  opacity: 1;
}

.empty-state {
  padding: 40px 0;
  color: #909399;
  text-align: center;

  p {
    margin-top: 10px;
  }
}
</style>
