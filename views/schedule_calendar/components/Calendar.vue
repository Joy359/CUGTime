<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
const calendar = ref<CalendarInstance>()

// 引入日历转换库
declare const calendarConverter: {
  solar2lunar: (
    y: number,
    m: number,
    d: number,
  ) => {
    lunarFestival: string | null
    festival: string | null
    IDayCn: string
    IMonthCn: string
    Term: string | null
    isTerm: boolean
  }
}

const getDateInfo = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const lunarInfo = calendarConverter.solar2lunar(y, m, d)

  return {
    solarFestival: lunarInfo.festival,
    lunarFestival: lunarInfo.lunarFestival,
    term: lunarInfo.Term,
    lunarDay: lunarInfo.IDayCn,
    lunarMonth: lunarInfo.IMonthCn,
    isTerm: lunarInfo.isTerm,
  }
}
const selectDate = (type: CalendarDateType) => {
  calendar.value?.selectDate(type)
}
</script>

<template>
  <el-calendar ref="calendar">
    <!--自定义日历头部-->
    <template #header="{ date }">
      <span>⚠️ 今日进度：作业剩余1项，待办已全部完成，继续努力！</span>
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">上一年</el-button>
        <el-button size="small" @click="selectDate('prev-month')">上一月</el-button>
        <el-button size="small" @click="selectDate('today')">今日</el-button>
        <el-button size="small" @click="selectDate('next-month')">下一月</el-button>
        <el-button size="small" @click="selectDate('next-year')">下一年</el-button>
      </el-button-group>
    </template>
    <!--展示日历中的节日和节气  -->
    <template #date-cell="{ data }: { data: { day: string } }">
      <div class="calendar-cell">
        <div class="solar-date">{{ data.day.split('-')[2] }}</div>
        <div class="lunar-info">
          <!-- 阳历节日 -->
          <div v-if="getDateInfo(data.day).solarFestival" class="festival solar">
            {{ getDateInfo(data.day).solarFestival }}
          </div>

          <!-- 农历节日 -->
          <div v-if="getDateInfo(data.day).lunarFestival" class="festival lunar">
            {{ getDateInfo(data.day).lunarFestival }}
          </div>

          <!-- 节气 -->
          <div v-if="getDateInfo(data.day).term" class="term">
            {{ getDateInfo(data.day).term }}
          </div>

          <!-- 普通农历日 -->
          <template
            v-if="
              !getDateInfo(data.day).solarFestival &&
              !getDateInfo(data.day).lunarFestival &&
              !getDateInfo(data.day).term
            "
          >
            <div class="lunar-day">
              {{ getDateInfo(data.day).lunarDay }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </el-calendar>
</template>

<style scoped>
.calendar-cell {
  height: 100%;
  padding: 8px;
  font-size: 14px;
}

.solar-date {
  margin-bottom: 2px;
  font-weight: 600;
}

.festival {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #f56c6c;
}

.term {
  font-size: 12px;
  color: #67c23a;
}

.lunar-day {
  font-size: 12px;
  color: #909399;
}

/* 区分公历/农历节日颜色 */
.festival.solar {
  color: #f56c6c;
} /* 红色 */
.festival.lunar {
  color: #e6a23c;
} /* 橙色 */
</style>
