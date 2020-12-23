// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});
const perf = getInstance(firebaseApp);

export function getInstance(firebaseApp) {
  // [START perf_get_instance]
  const { getPerformance } = require("firebase/performance");
  const perf = getPerformance(firebaseApp);
  // [END perf_get_instance]

  return perf;
}

export function addCustomTrace() {
  // [START perf_add_custom_trace]
  const { trace } = require("firebase/performance");

  const t = trace(perf, "CUSTOM_TRACE_NAME");
  t.start();

  // Code that you want to trace 
  // ...

  t.stop();
  // [END perf_add_custom_trace]
}

export function userTimingMarks() {
  // [START perf_user_timing_marks]
  const performance = window.performance;
  
  performance.mark("measurementStart");

  // Code that you want to trace 
  // ...

  performance.mark("measurementStop");
  performance.measure("customTraceName", "measurementStart", "measurementStop");
  // [END perf_user_timing_marks]
}

export function addCustomAttributes() {
  // [START perf_add_custom_attributes]
  const { trace } = require("firebase/performance");

  const t = trace(perf, "test_trace");
  t.putAttribute("experiment", "A");

  // Update scenario
  t.putAttribute("experiment", "B");

  // Reading scenario
  const experimentValue = t.getAttribute("experiment");

  // Delete scenario
  t.removeAttribute("experiment");

  // Read attributes
  const traceAttributes = t.getAttributes();
  // [END perf_add_custom_attributes]
}

export function addCustomMetrics() {
  async function retrieveInventory(inventoryIds) {
    return {};
  }

  // [START perf_add_custom_metrics]
  const { trace } = require("firebase/performance");

  async function getInventory(inventoryIds) {
    const t = trace(perf, "inventoryRetrieval");
  
    // Tracks the number of IDs fetched (the metric could help you to optimize in the future)
    t.incrementMetric("numberOfIds", inventoryIds.length);
  
    // Measures the time it takes to request inventory based on the amount of inventory
    t.start();
    const inventoryData = await retrieveInventory(inventoryIds);
    t.stop();
  
    return inventoryData;
  }
  // [END perf_add_custom_metrics]
}
