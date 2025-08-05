<template>
  <div id="app" class="p-4">
    <div class="main-container">
      <h1>MLOps Experiment Tracker</h1>
      <ExperimentViewer />
    </div>
  </div>
</template>

<script setup>
import ExperimentViewer from "./components/ExperimentViewer.vue";
import "primeflex/primeflex.css";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main-container {
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
}
</style>
