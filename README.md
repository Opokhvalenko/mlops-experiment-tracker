# MLOps Experiment Tracker

A single-page web application for visualizing and tracking machine learning experiment metrics from CSV logs.

## Features

-   **CSV File Upload**: Easily upload your experiment log files.
-   **Interactive Data Table**: View, sort, and paginate through your experiments.
-   **Dynamic Charting**: Select multiple experiments to compare their performance metrics (loss, accuracy, etc.) on a single, interactive line chart.
-   **Reactive Interface**: The chart and data table update automatically as you select different experiments or metrics.

## Technologies Used

This project is built with:

* **Vue 3**: A progressive JavaScript framework for building user interfaces.
* **PrimeVue**: A comprehensive UI component library for Vue, used for the data table, chart, accordion, and other UI elements.
* **PapaParse**: A powerful CSV parser for JavaScript to process the uploaded log files.
* **PrimeFlex**: A CSS utility library for flexible and responsive layouts.

## Project Structure

The project has a clean and simple structure:

* `src/components/ExperimentViewer.vue`: The main component that handles all the application's logic, including file upload, data processing, and visualization.
* `src/components/ExperimentCharts.vue`: A separate, reusable component for rendering the chart based on the provided data.
* `src/App.vue`: The root component that holds the main layout and the `ExperimentViewer`.
* `src/main.js`: The entry file for the application, where PrimeVue components are registered.

## Installation

To run this project locally, follow these steps:

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/mlops-experiment-tracker.git](https://github.com/your-username/mlops-experiment-tracker.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd mlops-experiment-tracker
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run serve
    ```
5.  Compiles and minifies for production:
    ```bash
    npm run build
    ```
6.  Lints and fixes files:
    ```bash
    npm run lint
    ```    
The application will be available at `http://localhost:8080` (or another port if 8080 is in use).

## Usage

1.  Click the "Choose" or "Upload" button to select your experiment log file in CSV format.
2.  The application will automatically parse the file and display a table of experiments.
3.  Select the experiments you want to compare using the checkboxes in the table.
4.  Use the metric selector to switch between different metrics (e.g., "loss" or "accuracy") to see the corresponding charts.

## CSV Data Format

The application expects a CSV file with the following columns:

| Column Name      | Description                                     |
| ---------------- | ----------------------------------------------- |
| `experiment_id`  | A unique identifier for each experiment.        |
| `step`           | The training step or epoch number.              |
| `metric_name`    | The name of the metric (e.g., "loss", "accuracy"). |
| `value`          | The value of the metric at that training step.  |
| `model_type`     | The type of model used in the experiment.       |
| `learning_rate`  | The learning rate used.                         |

---
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
