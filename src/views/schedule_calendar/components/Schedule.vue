<script setup lang="ts">
import { ref, computed } from 'vue'
import { CircleCheck, Delete, Edit, DocumentRemove } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 定义日程项的接口
 */
interface ScheduleItem {
  id: number // 唯一标识符
  time: string // 时间，格式为 HH:mm
  title: string // 日程标题
  completed: boolean // 是否已完成
}

/**
 * `schedules` 存储所有日程数据（仅存于内存，不持久化）
 */
const schedules = ref<ScheduleItem[]>([])

/**
 * 计算属性：按时间升序排列的日程列表
 */
const sortedSchedules = computed(() => {
  return [...schedules.value].sort((a, b) => a.time.localeCompare(b.time))
})

/**
 * 对话框状态管理
 */
const dialogVisible = ref(false) // 控制弹窗的显示与隐藏
const isEditing = ref(false) // 标记当前是否为编辑模式
const currentSchedule = ref<Partial<ScheduleItem>>({}) // 存储当前正在编辑或新建的日程

/**
 * 计算当前最大 ID 并生成新 ID
 */
const idCounter = computed(() => Math.max(0, ...schedules.value.map((item) => item.id)) + 1)

/**
 * 获取当前时间，并格式化为 HH:mm
 */
const getCurrentTime = (): string => {
  const now = new Date()
  return now.toTimeString().slice(0, 5) // 获取当前时间的 HH:mm 格式
}

/**
 * 打开编辑/创建对话框
 * @param {ScheduleItem} item - 传入已存在的日程项则为编辑模式，否则为新建模式
 */
const openEditor = (item?: ScheduleItem) => {
  isEditing.value = !!item // 判断是否为编辑模式

  currentSchedule.value = item
      ? { ...item } // 如果是编辑模式，复制现有数据
      : {
        time: getCurrentTime(), // 默认时间为当前时间
        title: '', // 默认标题为空
        completed: false, // 默认未完成
      }

  dialogVisible.value = true // 打开对话框
}

/**
 * 提交日程（用于新建或更新）
 */
const submitForm = () => {
  if (!currentSchedule.value.time || !currentSchedule.value.title) {
    ElMessage.warning('请填写完整信息') // 如果信息不完整，给出警告
    return
  }

  if (isEditing.value) {
    // 编辑模式下，找到对应的日程项并更新
    const index = schedules.value.findIndex((i) => i.id === currentSchedule.value.id)
    if (index > -1) {
      schedules.value.splice(index, 1, currentSchedule.value as ScheduleItem)
    }
  } else {
    // 新增模式，生成唯一 ID 并添加到数组
    schedules.value.push({
      ...currentSchedule.value,
      id: idCounter.value,
    } as ScheduleItem)
  }

  dialogVisible.value = false // 关闭对话框
}

/**
 * 删除日程项
 * @param {number} id - 需要删除的日程项的 ID
 */
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定永久删除该日程？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    schedules.value = schedules.value.filter((item) => item.id !== id) // 过滤掉被删除的项
    ElMessage.success('删除成功') // 提示删除成功
  })
}
</script>

<template>
  <div class="container">
    <!-- 日程卡片 -->
    <el-card class="schedule-card">
      <template #header>
        <div class="card-header">
          <h3>今日日程</h3>
          <el-button type="primary" size="small" @click="openEditor()">+ 新建日程</el-button>
        </div>
      </template>

      <!-- 日程列表 -->
      <el-timeline v-if="sortedSchedules.length > 0">
        <el-timeline-item
            v-for="item in sortedSchedules"
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

      <!-- 无日程时的空状态 -->
      <div v-else class="empty-state">
        <el-icon :size="40"><DocumentRemove /></el-icon>
        <p>今日暂无日程安排</p>
      </div>
    </el-card>

    <!-- 编辑/新增日程的弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑日程' : '新建日程'" width="450px">
      <el-form label-width="80px">
        <!-- 时间选择器（移除 arrow-control，恢复鼠标滚轮选择时间） -->
        <el-form-item label="时间" required>
          <el-time-picker
              v-model="currentSchedule.time"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择时间"
              size="large"
              clearable
          />
        </el-form-item>

        <!-- 日程标题 -->
        <el-form-item label="标题" required>
          <el-input
              v-model="currentSchedule.title"
              placeholder="请输入日程内容"
              maxlength="20"
              show-word-limit
          />
        </el-form-item>

        <!-- 日程状态 -->
        <el-form-item label="状态">
          <el-switch
              v-model="currentSchedule.completed"
              active-text="已完成"
              inactive-text="进行中"
          />
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认保存</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<style scoped>
/* 头部样式 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 日程项外层包裹样式 */
.schedule-item-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

/* 日程内容框（恢复背景和边框） */
.schedule-content {
  position: relative;
  flex: 1;
  padding: 10px;
  background: #f8f9fa; /* 浅灰色背景 */
  border: 1px solid #dcdfe6; /* 灰色边框 */
  border-radius: 6px; /* 圆角 */
  transition: all 0.3s;
}

/* 已完成日程的样式（加线 + 灰色背景） */
.schedule-content.completed {
  text-decoration: line-through;
  color: #909399;
  background: #ebeef5; /* 变浅一点，区分已完成 */
}

/* 操作按钮样式（编辑 & 删除） */
.action-buttons {
  margin-left: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

/* 鼠标悬停时显示操作按钮 */
.el-timeline-item:hover .action-buttons {
  opacity: 1;
}

/* 无日程时的空状态 */
.empty-state {
  padding: 40px 0;
  color: #909399;
  text-align: center;
}
/* 让时间选择器更容易点击 */
.el-time-picker {
  width: 100%;
}

/* 让输入框更整齐 */
.el-input {
  width: 100%;
}

</style>
