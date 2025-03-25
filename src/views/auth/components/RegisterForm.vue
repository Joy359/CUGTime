<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
// 表单数据
const form = reactive({
  phone: '',
  code: '',
  username: '',
  password: '',
  confirm_password: '',
})

// 验证规则
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirm_password: [
    {
      required: true,
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
})

// 验证码相关
const sendDisabled = ref(false)
const remainingTime = ref(60)

const sendCode = () => {
  formRef.value?.validateField('phone', (valid) => {
    if (valid) {
      sendDisabled.value = true
      const interval = setInterval(() => {
        remainingTime.value--
        if (remainingTime.value <= 0) {
          clearInterval(interval)
          sendDisabled.value = false
          remainingTime.value = 60
        }
      }, 1000)
    }
  })
}

// 注册提交
const handleRegister = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('提交注册:', {
        phone: form.phone,
        code: form.code,
        username: form.username,
        password: form.password,
      })
      router.push('/login')
    }
  })
}

const clearValidateField = (
  field: 'username' | 'password' | 'phone' | 'code' | 'confirm_password',
) => {
  if (formRef.value) {
    formRef.value.clearValidate([field]) // 清除指定字段的验证提示
  }
}
</script>

<template>
  <div class="container">
    <h2 class="header">注册</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="register-form">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          @focus="clearValidateField('username')"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
          @focus="clearValidateField('password')"
        ></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input
          v-model="form.confirm_password"
          type="password"
          placeholder="请再次输入密码"
          show-password
          @focus="clearValidateField('confirm_password')"
        ></el-input>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          @focus="clearValidateField('phone')"
        ></el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item label="验证码" prop="code">
        <div class="code-group">
          <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          <el-button
            type="primary"
            :disabled="sendDisabled"
            @click="sendCode"
            plain
            class="send-code-btn"
          >
            {{ sendDisabled ? `${remainingTime}s后重试` : '发送验证码' }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleRegister" class="register-btn">立即注册</el-button>
      </el-form-item>
    </el-form>

    <!-- 返回登录 -->
    <div class="login-link">
      <span style="color: #0ef">已有账号？</span>
      <router-link to="/login" class="link">
        <el-link type="primary" :underline="false">立即登录</el-link>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  flex-direction: column;
  padding: 30px 30px 0;
}
.header {
  font-size: 2rem;
  font-weight: 600;
  color: #0ef;
  text-align: center;
}
.register-form {
  display: flex;
  flex-direction: column;
  padding: 30px 15px 10px;
  gap: 5px;
  margin: 0 auto;
  .code-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    .el-button {
      flex: 1;
    }
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
}
.login-link {
  text-align: center;
}
</style>
