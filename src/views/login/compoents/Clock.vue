<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 定义一个响应式变量 currentTime，存储当前时间
const currentTime = ref(new Date())

// 计算属性：格式化时间（时、分、秒），确保两位数显示
const formattedTime = computed(() => ({
  hours: currentTime.value.getHours().toString().padStart(2, '0'),
  minutes: currentTime.value.getMinutes().toString().padStart(2, '0'),
  seconds: currentTime.value.getSeconds().toString().padStart(2, '0'),
}))

// 计算属性：格式化日期（星期、年、月、日）
const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }
  return currentTime.value.toLocaleDateString('zh-CN', options)
})

// 定义一个定时器变量，用于更新时间
let timer: number

// 组件挂载时，启动定时器，每秒更新时间
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

// 组件卸载前，清除定时器，防止内存泄漏
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="digital-clock">
    <div class="time-block">
      <!-- 显示时、分、秒，带动态冒号分隔符 -->
      <div class="time-section">
        <span class="hours">{{ formattedTime.hours }}</span>
        <span class="time-separator">:</span>
        <span class="minutes">{{ formattedTime.minutes }}</span>
        <span class="time-separator">:</span>
        <span class="seconds">{{ formattedTime.seconds }}</span>
      </div>
      <!-- 显示日期（包含星期） -->
      <div class="date-section">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 主要容器样式 */
.digital-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segment7Standard', monospace; /* 数字时钟风格字体 */
  text-shadow: 0 0 10px rgb(14 255 239 / 50%); /* 文字发光效果 */

  .time-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: transparent;
  }

  /* 时间部分的样式 */
  .time-section {
    display: flex;
    align-items: center;
    font-size: 3.5rem;
    color: transparent;
    background: linear-gradient(45deg, #0ef, #0ef); /* 渐变色文字 */
    -webkit-background-clip: text;
    background-clip: text;
    animation: text-glow 1.5s ease-in-out infinite alternate; /* 文字发光动画 */

    span {
      transition: all 0.3s ease;
    }
  }

  /* 时间分隔符（冒号）动画，使其有闪烁效果 */
  .time-separator {
    margin: 0 8px;
    animation: pulse 1s infinite;
  }

  /* 日期部分样式 */
  .date-section {
    margin-top: 15px;
    font-size: 1.2rem;
    color: rgb(14 255 239 / 80%);
    letter-spacing: 1px;
  }

  /* 文字发光动画 */
  @keyframes text-glow {
    from {
      text-shadow: 0 0 10px rgb(14 255 239 / 50%);
    }
    to {
      text-shadow:
          0 0 20px rgb(14 255 239 / 80%),
          0 0 30px rgb(14 255 239 / 60%);
    }
  }

  /* 闪烁动画，改变透明度与颜色 */
  @keyframes pulse {
    0%, 100% {
      color: #0ef;
      opacity: 1;
    }
    50% {
      color: #7fffd4; /* 颜色变化 */
      opacity: 0.3;
    }
  }
}
</style>