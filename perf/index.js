import firebase from "firebase/app";
import "firebase/performance";

const perf = firebase.performance();

function addCustomTrace() {
  // [START perf_add_custom_trace]
  const trace = perf.trace("CUSTOM_TRACE_NAME");
  trace.start();

  // Code that you want to trace 
  // ...

  trace.stop();
  // [END perf_add_custom_trace]
}

function userTimingMarks() {
  // [START perf_user_timing_marks]
  const performance = window.performance;
  
  performance.mark("measurementStart");

  // Code that you want to trace 
  // ...

  performance.mark("measurementStop");
  performance.measure("customTraceName", "measurementStart", "measurementStop");
  // [END perf_user_timing_marks]
}

function addCustomAttributes() {
  // [START perf_add_custom_attributes]
  const trace = perf.trace("test_trace");
  trace.putAttribute("experiment", "A");

  // Update scenario
  trace.putAttribute("experiment", "B");

  // Reading scenario
  const experimentValue = trace.getAttribute("experiment");

  // Delete scenario
  trace.removeAttribute("experiment");

  // Read attributes
  const traceAttributes = trace.getAttributes();
  // [END perf_add_custom_attributes]
}

function addCustomMetrics() {
  async function retrieveInventory(inventoryIds) {
    return {};
  }

  // [START perf_add_custom_metrics]
  async function getInventory(inventoryIds) {
    const trace = perf.trace("inventoryRetrieval");
  
    // Tracks the number of IDs fetched (the metric could help you to optimize in the future)
    trace.incrementMetric("numberOfIds", inventoryIds.length);
  
    // Measures the time it takes to request inventory based on the amount of inventory
    trace.start();
    const inventoryData = await retrieveInventory(inventoryIds);
    trace.stop();
  
    return inventoryData;
  }
  // [END perf_add_custom_metrics]
}
