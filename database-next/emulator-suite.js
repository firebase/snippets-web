// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function onDocumentReady() {
  // [START rtdb_emulator_connect]
  const { getDatabase, useDatabaseEmulator } = require("firebase/database");

  const db = getDatabase(firebaseApp);
  if (location.hostname === "localhost") {
    // Point to the RTDB emulator running on localhost.
    useDatabaseEmulator(db, "localhost", 9000);
  } 
  // [END rtdb_emulator_connect]
}

function flushRealtimeDatabase() {
  // [START rtdb_emulator_flush]
  const { getDatabase, ref, set } = require("firebase/database");

  // With a database Reference, write null to clear the database.
  const db = getDatabase(firebaseApp);
  set(ref(db), null);
  // [END rtdb_emulator_flush]
}
