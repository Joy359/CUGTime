<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'

/**
 * 创建一个对 Element Plus 日历组件的引用
 * 用于操作日历，如切换日期
 */
const calendar = ref<CalendarInstance>()

/**
 * 声明 `calendarConverter` 对象（用于公历转农历）
 * 该对象假设是外部引入的库，提供 `solar2lunar` 方法
 * `solar2lunar(y, m, d)` 返回关于该日期的农历信息，包括节日、节气、农历日期等
 */
declare const calendarConverter: {
  solar2lunar: (
      y: number,
      m: number,
      d: number,
  ) => {
    lunarFestival: string | null // 农历节日
    festival: string | null // 公历节日
    IDayCn: string // 农历日
    IMonthCn: string // 农历月
    Term: string | null // 节气（如立春、惊蛰）
    isTerm: boolean // 是否是节气日
  }
}

/**
 * 获取指定日期的详细信息（公历节日、农历节日、节气、农历日期等）
 * @param {string} dateStr - 日期字符串，格式为 'YYYY-MM-DD'
 * @returns {object} - 该日期的相关信息
 */
const getDateInfo = (dateStr: string) => {
  // 将日期字符串拆分成年、月、日，并转换为数字
  const [y, m, d] = dateStr.split('-').map(Number)

  // 使用 `calendarConverter.solar2lunar` 方法获取农历信息
  const lunarInfo = calendarConverter.solar2lunar(y, m, d)

  return {
    solarFestival: lunarInfo.festival, // 公历节日
    lunarFestival: lunarInfo.lunarFestival, // 农历节日
    term: lunarInfo.Term, // 节气
    lunarDay: lunarInfo.IDayCn, // 农历日
    lunarMonth: lunarInfo.IMonthCn, // 农历月
    isTerm: lunarInfo.isTerm, // 是否是节气
  }
}

/**
 * 切换日历的日期
 * @param {CalendarDateType} type - 要跳转的日期类型，例如 "prev-year"、"prev-month"、"today"、"next-month"、"next-year"
 */
const selectDate = (type: CalendarDateType) => {
  calendar.value?.selectDate(type) // 调用 Element Plus 的 `selectDate` 方法
}
</script>

<template>
  <!-- Element Plus 日历组件 -->
  <el-calendar ref="calendar">
    <!-- 自定义日历头部 -->
    <template #header="{ date }">
      <span>⚠️ 今日进度：作业剩余 1 项，待办已全部完成，继续努力！</span>
      <span>{{ date }}</span>
      <!-- 日期切换按钮 -->
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">上一年</el-button>
        <el-button size="small" @click="selectDate('prev-month')">上一月</el-button>
        <el-button size="small" @click="selectDate('today')">今日</el-button>
        <el-button size="small" @click="selectDate('next-month')">下一月</el-button>
        <el-button size="small" @click="selectDate('next-year')">下一年</el-button>
      </el-button-group>
    </template>

    <!-- 自定义日期单元格（显示公历/农历节日和节气） -->
    <template #date-cell="{ data }: { data: { day: string } }">
      <div class="calendar-cell">
        <!-- 显示公历日期（如 10 代表 10 号） -->
        <div class="solar-date">{{ data.day.split('-')[2] }}</div>

        <div class="lunar-info">
          <!-- 显示公历节日 -->
          <div v-if="getDateInfo(data.day).solarFestival" class="festival solar">
            {{ getDateInfo(data.day).solarFestival }}
          </div>

          <!-- 显示农历节日 -->
          <div v-if="getDateInfo(data.day).lunarFestival" class="festival lunar">
            {{ getDateInfo(data.day).lunarFestival }}
          </div>

          <!-- 显示节气 -->
          <div v-if="getDateInfo(data.day).term" class="term">
            {{ getDateInfo(data.day).term }}
          </div>

          <!-- 如果不是节日或节气，则显示农历日 -->
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
/* 日历单元格样式 */
.calendar-cell {
  height: 100%;
  padding: 8px;
  font-size: 14px;
}

/* 公历日期数字样式（如“10”表示10号） */
.solar-date {
  margin-bottom: 2px;
  font-weight: 600;
}

/* 节日文本样式 */
.festival {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #f56c6c; /* 默认红色 */
}

/* 节气文本样式 */
.term {
  font-size: 12px;
  color: #67c23a; /* 绿色表示节气 */
}

/* 农历日期文本样式 */
.lunar-day {
  font-size: 12px;
  color: #909399; /* 灰色，表示普通农历日期 */
}

/* 公历节日样式（红色） */
.festival.solar {
  color: #f56c6c;
}

/* 农历节日样式（橙色） */
.festival.lunar {
  color: #e6a23c;
}
</style>
