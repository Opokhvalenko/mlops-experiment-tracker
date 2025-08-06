<template>
  <div class="chart-container">
    <PChart type="line" :data="data" :options="chartOptions" />
  </div>
</template>

<script setup>
import PChart from "primevue/chart";
import { ref } from "vue";

defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Training Step",
      },
    },
    y: {
      title: {
        display: true,
        text: "Metric Value",
      },
    },
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
