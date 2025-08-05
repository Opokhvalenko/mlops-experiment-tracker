import { createApp } from "vue";
import App from "./App.vue";

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

import "primevue/resources/themes/lara-light-blue/theme.css";

import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primevue/datatable/style";
import "primevue/column/style";
import "primevue/fileupload/style";
import "primevue/chart/style";
import "primevue/progressspinner/style";
import "primevue/toast/style";
import "primevue/accordion/style";
import "primevue/accordiontab/style";
import "primevue/selectbutton/style";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import FileUpload from "primevue/fileupload";
import Chart from "primevue/chart";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import SelectButton from "primevue/selectbutton";

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);

app.component("PDataTable", DataTable);
app.component("PColumn", Column);
app.component("PFileUpload", FileUpload);
app.component("PChart", Chart);
app.component("PProgressSpinner", ProgressSpinner);
app.component("PToast", Toast);
app.component("PAccordion", Accordion);
app.component("PAccordionTab", AccordionTab);
app.component("PSelectButton", SelectButton);

app.mount("#app");
