const dropContainer = document.getElementById("btm-drop-file-container");
const fileInput = document.getElementById("data-body-temperature-monitoring");

const BTMForm = document.getElementById("form-body-temperature-monitoring");
const BTMFile = document.getElementById("data-body-temperature-monitoring");
const BTMTableContainer = document.getElementById("btm-table-container");

const BTMChart = document
  .getElementById("chart-body-temperature-monitoring")
  .getContext("2d");

let monitoringChart = null;
let tableConstructor = null;

const loadData = () => {
  if (!BTMFile.files[0]) {
    return;
  }
  console.time("answer time");

  const input = BTMFile.files[0];
  const reader = new FileReader();

  reader.onload = (process) => {
    const content = process.target.result;
    const btm = new BTMDataLoader(content);
    const data = btm.load();

    console.groupCollapsed("Data");

    console.info("Expected:");
    console.table([
      { timestamp: "Y-m-d H:i:s", temperature: "Number", magnitude: "Text" },
    ]);

    console.info("Received:");
    console.table(btm.data());

    console.timeEnd("answer time");
    console.groupEnd();

    if (!monitoringChart) {
      monitoringChart = new BodyTemperatureChart(BTMChart, data);
    }

    if (!tableConstructor) {
      tableConstructor = new BTMTable(BTMTableContainer, data);
    }

    monitoringChart.update(data);
    tableConstructor.update(data);
  };

  reader.readAsText(input);
};

BTMForm.addEventListener("submit", (form) => {
  form.preventDefault();

  loadData();
});

dropContainer.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
  },
  false
);

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active");
});

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active");
});

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  dropContainer.classList.remove("drag-active");
  fileInput.files = e.dataTransfer.files;
  loadData();
});
