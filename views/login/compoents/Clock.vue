<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const currentTime = ref(new Date())

// 时间格式化
const formattedTime = computed(() => ({
  hours: currentTime.value.getHours().toString().padStart(2, '0'),
  minutes: currentTime.value.getMinutes().toString().padStart(2, '0'),
  seconds: currentTime.value.getSeconds().toString().padStart(2, '0'),
}))

// 日期格式化
const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }
  return currentTime.value.toLocaleDateString('zh-CN', options)
})

// 更新时间
let timer: number
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="digital-clock">
    <div class="time-block">
      <div class="time-section">
        <span class="hours">{{ formattedTime.hours }}</span>
        <span class="time-separator">:</span>
        <span class="minutes">{{ formattedTime.minutes }}</span>
        <span class="time-separator">:</span>
        <span class="seconds">{{ formattedTime.seconds }}</span>
      </div>
      <div class="date-section">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.digital-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segment7Standard', monospace;
  text-shadow: 0 0 10px rgb(14 255 239 / 50%);

  .time-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: transparent;
  }

  .time-section {
    display: flex;
    align-items: center;
    font-size: 3.5rem;
    color: transparent;
    background: linear-gradient(45deg, #0ef, #0ef);
    -webkit-background-clip: text;
    background-clip: text;
    animation: text-glow 1.5s ease-in-out infinite alternate;

    span {
      transition: all 0.3s ease;
    }
  }

  .time-separator {
    margin: 0 8px;
    animation: pulse 1s infinite;
  }

  .date-section {
    margin-top: 15px;
    font-size: 1.2rem;
    color: rgb(14 255 239 / 80%);
    letter-spacing: 1px;
  }

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

  @keyframes pulse {
    0%,
    100% {
      color: #0ef;
      opacity: 1;
    }

    50% {
      color: #7fffd4; // 添加颜色变化
      opacity: 0.3;
    }
  }
}
</style>
