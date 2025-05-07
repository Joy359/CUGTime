<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import type { LoginForm } from '@/types/auth.ts'
import { login } from '@/api/auth'
import { useUserStore } from '@/store/user.ts'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>() // 声明表单实例
const form = reactive<LoginForm>({
  username: '',
  password: '',
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const clearValidateField = (field: 'username' | 'password') => {
  if (formRef.value) {
    formRef.value.clearValidate([field]) // 清除指定字段的验证提示
  }
}
// 登录方法
const handleLogin = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate() // 触发验证
    // 验证通过后执行登录逻辑
    const response = await login(form)
    userStore.userInfo.token = response.token
    userStore.userInfo.username = response.username
    userStore.loginTime = new Date()
    // token 本地存储
    localStorage.setItem('token', response.token)
    localStorage.setItem('username', response.username)
    console.log(response.username)
    console.log(localStorage.getItem('username'))
    await router.push('/home')
    ElMessage.success('登录成功')
  } catch {
    return
  }
}

const forgot_password = () => {
  router.push('/forgot-password')
}
const register = () => {
  router.push('/register')
}
</script>

<template>
  <div class="container">
    <h2 class="header">登录</h2>
    <el-form ref="formRef" class="login-form" :rules="rules" :model="form">
      <el-form-item class="username" prop="username">
        <el-input
          v-model="form.username"
          placeholder="用户名"
          prefix-icon="User"
          @focus="clearValidateField('username')"
        ></el-input>
      </el-form-item>
      <el-form-item class="password" prop="password">
        <el-input
          v-model="form.password"
          placeholder="密码"
          type="password"
          prefix-icon="Lock"
          show-password
          @focus="clearValidateField('password')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login" @click="handleLogin">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" link class="forgot-password" @click="forgot_password">
          忘记密码?
        </el-button>
        <el-button type="primary" link class="register" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.container {
  flex-direction: column;
  padding: 40px;
}
.header {
  font-size: 2rem;
  font-weight: 600;
  color: #0ef;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  color: #0ef;

  :deep(.el-form-item) {
    position: relative;
    width: 100%;

    .el-form-item__content {
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
          height: 50px;
          outline: none;
          background: transparent;
          border: 2px solid #2c4766;
          border-radius: 40px;

          &:focus-within {
            border-color: #0ef;
            box-shadow: 0 0 15px rgb(0 238 255 / 30%);
          }
        }

        &__inner {
          padding: 0 25px;
          color: #fff;
        }
      }
    }

    :last-child {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .login {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 45px;
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

  // 图标基础样式
  :deep(.el-input__prefix) {
    .el-icon {
      font-size: 1.25rem;
      color: rgb(255 255 255 / 60%);
      transition: all 0.3s ease;
    }
  }

  // 输入框聚焦时的图标效果
  :deep(.el-input__wrapper.is-focus) {
    .el-input__prefix .el-icon {
      color: #0ef;
      filter: drop-shadow(0 0 2px rgb(14 255 239 / 50%));
      transform: scale(1.2);
    }
  }
}
</style>
