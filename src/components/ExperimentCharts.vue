<template>
  <div class="chart-container">
    <PChart type="line" :data="data" :options="chartOptions" />
  </div>
</template>

<script>
import PChart from "primevue/chart";

export default {
  name: "ExperimentCharts",
  components: {
    PChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
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
      },
    };
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
