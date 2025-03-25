<script setup lang="ts">
import { computed } from 'vue'
import { useProcessStore } from '@/store/process.ts'
const processStore = useProcessStore()

const tableData = computed(() => Array.from(processStore.processMap.values()))
console.log(processStore.processMap)
console.log(tableData.value)
</script>

<template>
  <el-table :data="tableData">
    <el-table-column type="selection" width="48" align="center" />
    <el-table-column prop="content" label="ID" width="180"></el-table-column>
    <el-table-column prop="end-time" label="ID" width="180"></el-table-column>
  </el-table>
</template>

<style scoped lang="scss"></style>
