<script lang="ts" setup>
import Schedule from './components/Schedule.vue'
import Calendar from './components/Calendar.vue'
</script>

<template>
  <div class="container">
    <Calendar />
    <Schedule />
  </div>
</template>

<style scoped>
.container {
  flex-direction: column;
  gap: 10px; /* 子元素间距 */
  margin: 0 auto;
}
</style>
