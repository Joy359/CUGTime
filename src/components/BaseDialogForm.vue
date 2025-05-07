<!--对话框形式的表单，用于处理通用的添加和编辑操作-->
<script setup lang="ts" generic="T extends Record<string, any>">
import { ElForm, ElMessage } from 'element-plus'
import { isEqual } from 'lodash-es'
import { type Ref, watch } from 'vue'

// 定义表单项配置项接口
// 表单绑定的数据模型类型 比如User Plan等
export interface FormItem<T> {
  label: string // 表单项显示的标签文本 比如用户名, 密码等
  prop: keyof T // 表单项的属性名，用于与数据对象进行关联 比如username,password等
  type: 'input' | 'textarea' | 'datetime' | 'radio' | 'switch' | 'select' // 表单项类型，可选值为 'input', 'textarea', 'datetime', 'radio', 'switch'
  required?: boolean // 是否必填
  placeholder?: string // 占位提示
  options?: { label: string; value: string | number }[] // 选项列表，用于radio等类型比如{ label: '管理员', value: 'admin' },{ label: '普通用户', value: 'user' }
  visible?: boolean | Ref<boolean> // 是否可见
  dateConfig?: {
    // 日期类型专用配置（当type为datetime时有效）
    format?: string // 日期显示格式（如：'yyyy-MM-dd'）
    defaultTime?: Date // 默认选中时间
    placement?: string // 日期弹出框位置
    valueFormat?: string // 提交数据的格式 如"YYYY-MM-DDTHH:mmZ"
  }
  switchConfig?: {
    // 开关类型专用配置（当type为switch时有效）
    activeText?: string // 开启状态的提示文本
    inactiveText?: string // 关闭状态的提示文本
  }
}
// 定义对话框配置项接口
// 表单绑定的数据模型类型
export interface DialogConfig<T> {
  title: string | Ref<string> // 对话框标题
  formItems: FormItem<T>[] // 表单字段配置项数组
  validationRules?: (data: T) => string | boolean // 自定义表单验证规则，返回错误信息或者true
  submitHandler: (data: T) => Promise<void> // 表单提交处理函数，返回Promise
  cacheCheck?: boolean // 缓存功能，比较数据是否发生变化, 默认关闭
  cacheData?: T | Ref<T>
  disableDefaultValidation?: boolean // 是否禁用默认的表单验证，默认为false
  defaultRequiredMessage?: string | ((item: FormItem<T>) => string) // 自定义必填字段的提示信息，默认为"{label}不能为空"
}
// 接收父组件传递的属性
interface Props {
  visible: boolean
  dialogType: 'add' | 'edit' | ''
  formData: T
  config: DialogConfig<T>
}
const props = defineProps<Props>()
// 定义事件
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void // 对话框可见状态改变
  (e: 'closed'): void // 对话框关闭事件
  (e: 'update:formData', value: T | Ref<T>): void
  (e: 'update:cacheData', value: T | Ref<T>): void
}>()
let warningMessage: { close: () => void } | null = null
// 处理表单提交事件
const handleSubmit = async () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }

  if (!props.config.disableDefaultValidation) {
    // 默认的表单验证，检查必填字段是否填写
    const emptyItem = props.config.formItems.find(
      (item) =>
        item.required &&
        (props.formData[item.prop] === undefined ||
          props.formData[item.prop] === null ||
          props.formData[item.prop] === ''),
    )
    if (emptyItem) {
      const message =
        typeof props.config.defaultRequiredMessage === 'function'
          ? props.config.defaultRequiredMessage(emptyItem)
          : props.config.defaultRequiredMessage || `${emptyItem.label}不能为空`

      warningMessage = ElMessage.warning(message)
      return
    }
  }

  // 执行自定义验证规则（如果存在）
  if (props.config.validationRules) {
    const validationResult = props.config.validationRules(props.formData)
    if (typeof validationResult === 'string') {
      warningMessage = ElMessage.warning(validationResult)
      return
    }
  }

  // 开启缓存功能，比较数据是否发生变化
  if (props.config.cacheCheck && props.config.cacheData) {
    if (isEqual(props.formData, props.config.cacheData)) {
      warningMessage = ElMessage.warning('未作任何修改')
      return
    }
  }
  // 执行表单提交处理函数，返回Promise
  await props.config.submitHandler(props.formData)
  emit('update:visible', false) // 关闭对话框
}
// 缓存初始副本，用于重置表单
const defaultForm = {} as T
Object.assign(defaultForm, props.formData)
const handleUpdate = (val: boolean) => {
  emit('update:visible', val)
  // 当关闭对话框时 重置当前表单数据为初始副本
  if (!val) {
    emit('update:formData', {...defaultForm})
  }
}
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.dialogType === 'edit' && props.config.cacheData) {
      // 通知父组件更新formData
      emit('update:formData', { ...props.config.cacheData })
    }
  },
)
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="config.title"
    class="my-global-dialog"
    @update:model-value="handleUpdate"
  >
    <el-form :model="formData" class="my-global-form" ref="myForm">
      <template v-for="item in config.formItems" :key="String(item.prop)">
        <el-form-item
          :label="item.label"
          :required="item.required"
          v-if="item.visible === undefined || item.visible === true"
        >
          <!-- Input -->
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
          />

          <!-- Textarea -->
          <el-input
            v-else-if="item.type === 'textarea'"
            v-model="formData[item.prop]"
            type="textarea"
            :placeholder="item.placeholder || `请输入${item.label}`"
          />

          <!-- Datetime -->
          <el-date-picker
            v-else-if="item.type === 'datetime'"
            v-model="formData[item.prop]"
            type="datetime"
            :format="item.dateConfig?.format || 'YYYY-MM-DD HH:mm'"
            :default-time="item.dateConfig?.defaultTime"
            :placement="item.dateConfig?.placement || 'right-start'"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :value-format="item.dateConfig?.valueFormat"
          />

          <!-- Radio Group -->
          <el-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.prop]">
            <el-radio v-for="opt in item.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>

          <!-- Switch -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop]"
            :active-text="item.switchConfig?.activeText || '是'"
            :inactive-text="item.switchConfig?.inactiveText || '否'"
          />
          <!-- Select-->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <!-- 其他-->
          <slot v-else :item="item" />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ dialogType === 'add' ? '确认添加' : '确认更新' }}
      </el-button>
    </template>
  </el-dialog>
</template>
