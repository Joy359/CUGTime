<script setup lang="ts">
import { useTodoStore } from '@/store/todo.ts'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import type { CategoryMap } from '@/types/todo'
import { Bell, Calendar, CircleCheck, Refresh, Warning } from '@element-plus/icons-vue'
import { isEqual } from 'lodash-es'
import { setDefaultTime } from '@/utils/time-utils.ts'
import { useDialogStore } from '@/store/dialog.ts'

const todoStore = useTodoStore()
const dialogStore = useDialogStore()
const { currentTodo, currentTodoCache } = storeToRefs(todoStore)
const { getCategory } = useTodoStore()
const categoryMap: CategoryMap = {
  today: { label: '今日任务', icon: Calendar },
  tomorrow: { label: '明日任务', icon: Bell },
  future: { label: '未来任务', icon: Refresh },
  expired: { label: '已过期', icon: Warning },
  noDate: { label: '无日期', icon: CircleCheck },
  completed: { label: '已完成', icon: CircleCheck },
}
const dialogVisible = dialogStore.visible('todo')
let warningMessage: { close: () => void } | null = null
const handleAddTodo = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentTodo.value.title) {
    warningMessage = ElMessage.warning('请填写标题')
    return
  }
  todoStore.addTodo(currentTodo.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `已添加任务：${currentTodo.value.title} ==> ${categoryMap[getCategory(currentTodo.value)].label}`,
      duration: 3000,
    })
    dialogStore.close('todo_add')
  })
}

const handleUpdateTodo = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentTodo.value.title) {
    warningMessage = ElMessage.warning('请填写标题')
    return
  }
  if (isEqual(currentTodo.value, currentTodoCache.value)) {
    warningMessage = ElMessage.warning('未作任何修改')
    return
  }
  todoStore.updateTodo(currentTodo.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `已更新任务：${currentTodo.value.title} ===> ${categoryMap[getCategory(currentTodo.value)].label}`,
      duration: 3000,
    })
    dialogStore.close('todo_edit')
  })
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="dialogStore.title" class="my-global-dialog">
    <el-form :model="currentTodo" class="my-global-form">
      <el-form-item label="标题" required>
        <el-input v-model="currentTodo.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="优先级">
        <el-radio-group v-model="currentTodo.priority">
          <el-radio value="low">忽略</el-radio>
          <el-radio value="medium">普通</el-radio>
          <el-radio value="high">重要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="截止日期">
        <el-date-picker
          v-model="currentTodo.deadline"
          type="datetime"
          placeholder="选择日期和时间"
          format="YYYY/MM/DD HH:mm"
          :default-time="setDefaultTime()"
          placement="right-start"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="currentTodo.isCompleted" active-text="已完成" inactive-text="进行中" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="currentTodo.description" type="textarea" placeholder="描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogStore.closeAll('todo')">取消</el-button>
      <el-button type="primary" @click="handleAddTodo" v-if="dialogStore.title ==='新建待办'">
        确认添加
      </el-button>
      <el-button type="primary" @click="handleUpdateTodo" v-else>确认更新</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
