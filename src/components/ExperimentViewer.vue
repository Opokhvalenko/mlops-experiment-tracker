<template>
  <div class="p-4">
    <PToast />

    <div class="card flex justify-content-center mb-4">
      <PFileUpload
        mode="basic"
        name="demo[]"
        customUpload
        :auto="true"
        :maxFileSize="30000000"
        accept=".csv"
        @uploader="onUpload"
      />
    </div>

    <div v-if="isLoading" class="loading-container">
      <PProgressSpinner />
      <p>Parsing CSV file...</p>
    </div>

    <PAccordion :multiple="true" :activeIndex="[0, 1]">
      <PAccordionTab header="Experiments">
        <div v-if="experiments.length && !isLoading" class="card">
          <PDataTable
            :value="experiments"
            selectionMode="multiple"
            v-model:selection="selectedExperiments"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
            scrollable
            scrollHeight="400px"
          >
            <PColumn selectionMode="multiple" headerStyle="width: 3rem" />
            <PColumn field="id" header="Experiment ID" :sortable="true" />
            <PColumn field="model_type" header="Model Type" :sortable="true" />
            <PColumn
              field="learning_rate"
              header="Learning Rate"
              :sortable="true"
            />
          </PDataTable>
        </div>
      </PAccordionTab>

      <PAccordionTab header="Experiment Metrics">
        <div
          v-if="internalChartData.datasets.length && !isLoading"
          class="card mt-4"
        >
          <div class="flex align-items-center justify-content-between mb-3">
            <h3>Metrics</h3>
            <PSelectButton
              v-model="selectedMetric"
              :options="metricOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>
          <ExperimentCharts :data="internalChartData" />
        </div>
      </PAccordionTab>
    </PAccordion>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import Papa from "papaparse";
import PFileUpload from "primevue/fileupload";
import PDataTable from "primevue/datatable";
import PColumn from "primevue/column";
import ExperimentCharts from "./ExperimentCharts.vue";
import PProgressSpinner from "primevue/progressspinner";
import PToast from "primevue/usetoast";
import PAccordion from "primevue/accordion";
import PAccordionTab from "primevue/accordiontab";
import PSelectButton from "primevue/selectbutton";
import { useToast } from "primevue/usetoast";

const allData = ref([]);
const experiments = ref([]);
const selectedExperiments = ref([]);
const isLoading = ref(false);
const toast = useToast();
const internalChartData = ref({ labels: [], datasets: [] });
const selectedMetric = ref("loss");
const metricOptions = ref([]);

const colorPalette = [
  "#42A5F5",
  "#66BB6A",
  "#FFA726",
  "#EF5350",
  "#7E57C2",
  "#00BCD4",
  "#FFCA28",
  "#8D6E63",
  "#EC407A",
  "#26A69A",
];

let debounceTimer = null;
const experimentColorMap = new Map();

const onUpload = ({ files }) => {
  const file = files[0];
  if (file) {
    isLoading.value = true;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      worker: true,
      complete: (results) => {
        allData.value = results.data.filter((row) =>
          Object.values(row).some((val) => val !== null && val !== "")
        );
        if (allData.value.length) processData(allData.value);
        isLoading.value = false;
        toast.add({
          severity: "success",
          summary: "Parsed",
          detail: "CSV parsed successfully.",
          life: 3000,
        });
      },
      error: () => {
        isLoading.value = false;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error parsing CSV file.",
          life: 3000,
        });
      },
    });
  }
};

const processData = (data) => {
  const uniqueExperimentIds = [
    ...new Set(data.map((item) => item.experiment_id)),
  ];
  experiments.value = uniqueExperimentIds.map((id) => {
    const first = data.find((item) => item.experiment_id === id);
    return {
      id,
      model_type: first.model_type,
      learning_rate: first.learning_rate,
    };
  });
  const uniqueMetrics = [...new Set(data.map((item) => item.metric_name))];
  metricOptions.value = uniqueMetrics.map((m) => ({ label: m, value: m }));
  selectedMetric.value = uniqueMetrics[0] || "loss";

  uniqueExperimentIds.forEach((id, index) => {
    if (!experimentColorMap.has(id)) {
      experimentColorMap.set(id, colorPalette[index % colorPalette.length]);
    }
  });
};

const updateChartData = () => {
  if (!selectedExperiments.value.length || !allData.value.length) {
    internalChartData.value = { labels: [], datasets: [] };
    isLoading.value = false;
    return;
  }

  const datasets = [];
  const steps = new Set();
  const sortedExperiments = [...selectedExperiments.value].sort((a, b) => {
    const idA = parseInt(a.id.split("_")[1]);
    const idB = parseInt(b.id.split("_")[1]);
    return idA - idB;
  });

  sortedExperiments.forEach((exp) => {
    const metricsForExp = allData.value.filter(
      (item) =>
        item.experiment_id === exp.id &&
        item.metric_name === selectedMetric.value
    );

    const filtered = metricsForExp.sort((a, b) => a.step - b.step);

    filtered.forEach((item) => steps.add(item.step));

    datasets.push({
      label: `${exp.id} - ${selectedMetric.value}`,
      data: filtered.map((item) => item.value),
      borderColor: experimentColorMap.get(exp.id),
      fill: false,
      tension: 0.3,
      borderWidth: 2,
    });
  });

  const sortedSteps = [...steps].sort((a, b) => a - b);

  internalChartData.value = {
    labels: sortedSteps,
    datasets: datasets,
  };
  isLoading.value = false;
};

watch(
  [selectedExperiments, selectedMetric],
  () => {
    clearTimeout(debounceTimer);
    isLoading.value = true;
    debounceTimer = setTimeout(() => {
      updateChartData();
    }, 500);
  },
  { deep: true }
);

onUnmounted(() => {
  clearTimeout(debounceTimer);
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.loading-container p {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #666;
}
</style>
