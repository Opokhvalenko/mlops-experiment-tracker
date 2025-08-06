import { ref, watch, onUnmounted } from "vue";
import Papa from "papaparse";

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
const experimentColorMap = new Map();
let debounceTimer = null;

export default function useExperimentLogic(toast) {
  const allData = ref([]);
  const experiments = ref([]);
  const selectedExperiments = ref([]);
  const isLoading = ref(false);
  const isChartLoading = ref(false);
  const internalChartData = ref({ labels: [], datasets: [] });
  const selectedMetric = ref("loss");
  const metricOptions = ref([]);

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
      isChartLoading.value = false;
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
    isChartLoading.value = false;
  };

  watch(
    [selectedExperiments, selectedMetric],
    () => {
      if (selectedExperiments.value.length > 0) {
        clearTimeout(debounceTimer);
        isChartLoading.value = true;
        debounceTimer = setTimeout(() => {
          updateChartData();
        }, 500);
      }
    },
    { deep: true }
  );

  onUnmounted(() => {
    clearTimeout(debounceTimer);
  });

  return {
    experiments,
    selectedExperiments,
    isLoading,
    isChartLoading,
    internalChartData,
    selectedMetric,
    metricOptions,
    onUpload,
  };
}
