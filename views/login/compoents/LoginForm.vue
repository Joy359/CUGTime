<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
})
// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const login = () => {
  if (form.username === 'admin' && form.password === '123') {
    router.push('/home') // 跳转到首页
  } else {
    ElMessage.error('账号或密码错误')
  }
}
</script>

<template>
  <h2 class="login-header">登录</h2>
  <el-form class="login-form" :rules="rules" :model="form">
    <el-form-item class="username">
      <el-input v-model="form.username" placeholder="用户名" prefix-icon="User"></el-input>
    </el-form-item>
    <el-form-item class="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        type="password"
        prefix-icon="Lock"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-btn" @click="login">登录</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" link class="forgot-password">忘记密码?</el-button>
      <el-button type="primary" link class="register-btn">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.login-header {
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

    .login-btn {
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
