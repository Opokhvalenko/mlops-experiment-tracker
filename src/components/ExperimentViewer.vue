<template>
  <div class="p-4">
    <PToast />

    <div class="card flex justify-content-center mb-4">
      <PFileUpload
        mode="basic"
        name="demo[]"
        custom-upload
        :auto="true"
        :max-file-size="30000000"
        accept=".csv"
        @uploader="onUpload"
      />
    </div>

    <div v-if="isLoading" class="loading-container-fullscreen">
      <PProgressSpinner />
      <p>Parsing CSV file...</p>
    </div>

    <PAccordion :multiple="true" :active-index="[0, 1]">
      <PAccordionTab header="Experiments">
        <div v-if="experiments.length && !isLoading" class="card">
          <PDataTable
            v-model:selection="selectedExperiments"
            :value="experiments"
            selection-mode="multiple"
            data-key="id"
            :paginator="true"
            :rows="10"
            :rows-per-page-options="[10, 25, 50]"
            scrollable
            scroll-height="400px"
          >
            <PColumn selection-mode="multiple" header-style="width: 3rem" />
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
        <div v-if="!isLoading" class="card mt-4">
          <div v-if="isChartLoading" class="loading-container-chart">
            <PProgressSpinner />
          </div>
          <div v-if="internalChartData.datasets.length">
            <div class="flex align-items-center justify-content-between mb-3">
              <h3>Metrics</h3>
              <PSelectButton
                v-model="selectedMetric"
                :options="metricOptions"
                option-label="label"
                option-value="value"
              />
            </div>
            <ExperimentCharts :data="internalChartData" />
          </div>
        </div>
      </PAccordionTab>
    </PAccordion>
  </div>
</template>

<script setup>
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

import useExperimentLogic from "../composables/useExperimentLogic.js";

const toast = useToast();

const {
  experiments,
  selectedExperiments,
  isLoading,
  isChartLoading,
  internalChartData,
  selectedMetric,
  metricOptions,
  onUpload,
} = useExperimentLogic(toast);
</script>

<style scoped>
.loading-container-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}
.loading-container-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}
.loading-container-fullscreen p {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #666;
}
</style>
