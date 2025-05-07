<script lang="ts" setup>
import Calendar from './components/Calendar.vue'
</script>

<template>
  <div class="container">
    <Calendar />
  </div>
</template>

<style scoped>
.container {
  flex-direction: column;
  gap: 10px; /* 子元素间距 */
  margin: 0 auto;
}
</style>
