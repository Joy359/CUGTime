<script setup lang="ts">
import { useUserStore } from '@/store/user.ts'
import router from '@/router'
const userStore = useUserStore()
// 根据时间返回欢迎语
const getWelcome = () => {
  const hours = userStore.loginTime.getHours()
  console.log(userStore.loginTime)
  const username = userStore.userInfo.username || '尊贵的用户'
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
    userStore.loginTime.getDay()
  ]

  // 时段配置
  const timePhrases: Record<string, { emoji: string; templates: string[] }> = {
    dawn: {
      emoji: '🌙',
      templates: [
        `${username}，夜深了，注意休息哦`,
        '凌晨的星光很美，但别熬太晚',
        '夜深人静正是专注的好时候',
      ],
    },
    morning: {
      emoji: '🌅',
      templates: [
        `新的一天开始啦，${username}今天也要加油哦`,
        '晨光熹微，美好正在发生',
        '早餐要吃好，今天能量已充满',
      ],
    },
    forenoon: {
      emoji: '☕',
      templates: [
        `${username}，需要来杯咖啡提神吗？`,
        '工作效率提升黄金时段',
        '上午的会议准备好了吗',
      ],
    },
    noon: {
      emoji: '🍱',
      templates: [
        '午餐时间到，记得按时吃饭哦',
        '午间小憩，为下午充充电',
        `${username}今天想吃什么？`,
      ],
    },
    afternoon: {
      emoji: '🕶️',
      templates: [
        '午后阳光正好，保持状态哦',
        '下午茶时间到，补充点能量吧',
        `${username}今天已完成${Math.floor(Math.random() * 60 + 40)}%目标`,
      ],
    },
    evening: {
      emoji: '🌆',
      templates: [
        '下班时间到，记得劳逸结合',
        '晚风轻拂，适合散步的好时候',
        `${username}今天过得充实吗？`,
      ],
    },
    night: {
      emoji: '🌃',
      templates: [
        '晚间时光，享受属于自己的时刻',
        '今天辛苦了，好好放松一下吧',
        `${username}明天也要继续加油哦`,
      ],
    },
  }

  // 获取当前时段
  let period: string
  if (hours < 5) {
    period = 'dawn'
  } else if (hours < 9) {
    period = 'morning'
  } else if (hours < 12) {
    period = 'forenoon'
  } else if (hours < 14) {
    period = 'noon'
  } else if (hours < 17) {
    period = 'afternoon'
  } else if (hours < 20) {
    period = 'evening'
  } else {
    period = 'night'
  }

  // 随机选择模板
  const { emoji, templates } = timePhrases[period]
  const randomIndex = Math.floor(Math.random() * templates.length)

  return `${emoji} ${templates[randomIndex]}  ${weekDay}`

}
const username = localStorage.getItem('username')
</script>

<template>
  <!--  欢迎区域-->
  <div class="header-container">
    <div class="welcome">
      <span>{{ getWelcome() }}</span>
    </div>
    <el-tooltip placement="bottom" :show-after="100" effect="light" :content="username">
      <div class="user-center">
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo.avatar || ''">
              {{ userStore.userInfo.username?.charAt(0) || '用户' }}
            </el-avatar>
            <span class="username">{{ userStore.userInfo.username || '未登录用户' }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="router.push('/login')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped>
.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.welcome {
  color: #fff;
}
.header-menu {
  justify-content: flex-end;
  --el-menu-bg-color: #606266;
}
</style>
