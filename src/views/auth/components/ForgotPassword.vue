<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({
  phone: '',
  code: '',
  password: '',
  confirm_password: '',
})

// 表单验证规则
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码应为6位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/,
      message: '密码需包含数字和字母，6-16位',
      trigger: 'blur',
    },
  ],
  confirm_password: [
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 验证码相关
const sendDisabled = ref(false)
const remainingTime = ref(60)
const sendText = ref('发送验证码')

const sendVerificationCode = () => {
  formRef.value?.validateField('phone', (valid) => {
    if (valid) {
      sendDisabled.value = true
      const interval = setInterval(() => {
        remainingTime.value--
        sendText.value = `${remainingTime.value}s后重试`
        if (remainingTime.value <= 0) {
          clearInterval(interval)
          sendDisabled.value = false
          remainingTime.value = 60
          sendText.value = '重新发送'
        }
      }, 1000)
      // 发送验证码请求（需替换为实际接口）
      axios.post('/api/send-verify-code', { phone: form.phone }).catch(() => {
        sendDisabled.value = false
        remainingTime.value = 60
        sendText.value = '重新发送'
      })
    }
  })
}

// 表单提交
const submitting = ref(false)
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      submitting.value = true
      axios
        .post('/api/reset-password', {
          phone: form.phone,
          code: form.code,
          password: form.password,
        })
        .then(() => {
          router.push('/login')
        })
        .catch(() => {
          // 处理错误
        })
        .finally(() => {
          submitting.value = false
        })
    }
  })
}

// 清除验证
const clearValidate = (field: string) => {
  formRef.value?.clearValidate([field])
}
</script>

<template>
  <div class="container">
    <h2 class="header">找回密码</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="forgot-form">
      <!-- 手机号输入 -->
      <el-form-item label="注册手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入注册手机号"
          @focus="clearValidate('phone')"
        >
          <template #prefix>
            <i class="el-icon-mobile-phone"></i>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入 -->
      <el-form-item label="验证码" prop="code">
        <div class="code-group">
          <el-input v-model="form.code" placeholder="请输入验证码" @focus="clearValidate('code')">
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="sendDisabled"
            @click="sendVerificationCode"
            plain
            class="send-code-btn"
          >
            {{ sendText }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 新密码输入 -->
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入6-16位新密码"
          show-password
          @focus="clearValidate('password')"
        >
          <template #prefix>
            <i class="el-icon-key"></i>
          </template>
        </el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input
          v-model="form.confirm_password"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          @focus="clearValidate('confirm_password')"
        >
          <template #prefix>
            <i class="el-icon-key"></i>
          </template>
        </el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" class="submit-btn" :loading="submitting">
          确认重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.container {
  flex-direction: column;
  padding: 40px;

  .header {
    font-size: 2rem;
    font-weight: 600;
    color: #0ef;
    text-align: center;
  }
  :deep(.el-form-item) {
    // 设置label
    .el-form-item__label {
      color: #0ef;
      text-align: left !important;
      justify-content: flex-start !important; // 新增关键属性
    }
    // 设置input
    .el-input {
      // 解决浏览器自动填充覆盖样式的问题
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-background-clip: text;
        box-shadow: 0 0 8px transparent;
        transition: background-color 5000s ease-in-out 0s;
        -webkit-text-fill-color: #fff;
      }

      &__wrapper {
        position: relative;
        outline: none;
        background: transparent;
        width: 100%;
        border: 2px solid #2c4766;
        border-radius: 15px;

        &:focus-within {
          border-color: #0ef;
          box-shadow: 0 0 15px rgb(0 238 255 / 30%);
        }
      }

      &__inner {
        padding: 10px 10px;
        color: #fff;
      }
      &__prefix {
        color: #0ef !important; // 确保图标颜色可见
        right: 8px;
      }
    }
    .send-code-btn {
      width: 45%;
      font-size: 0.9rem;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.8);
      background: rgb(0 238 255 / 60%);
    }
    // 单独处理注册按钮容器
    &:last-child .el-form-item__content {
      margin-left: 30px !important;
      display: flex;
      justify-content: center;
    }

    .register-btn {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 40px;
      font-size: 1rem;
      font-weight: 600;
      color: #1f293a;
      cursor: pointer;
      background: #0ef;

      // 渐变动画效果
      background: linear-gradient(45deg, #0ef, #0ef);
      border-radius: 40px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 0 15px rgb(0 238 255 / 50%);
        transform: scale(1.05);
      }
    }
  }
  .forgot-form {
    display: flex;
    flex-direction: column;
    padding: 30px 15px 10px;
    gap: 5px;
    margin: 0 auto;
    .code-group {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      .send-code-btn {
        flex: 1;
        background: #0ef;
        &:hover {
          background: darken(#0ef, 10%);
        }
      }
    }

    .el-form-item__content {
      .el-input {
        &__inner {
          padding: 12px 15px;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          transition: all 0.3s;
        }
        &:focus {
          border-color: #0ef;
          box-shadow: 0 0 0 2px rgba(14, 188, 225, 0.2);
        }
      }
    }
    .submit-btn {
      width: 100%;
      height: 44px;
      font-size: 16px;
      border-radius: 22px;
      background: linear-gradient(45deg, #0ef, #2c4766);
      &:hover {
        background: linear-gradient(135deg, #0ef, #2c4766);
      }
    }
  }
}
</style>
