// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function onDocumentReady() {
  // [START rtdb_emulator_connect]
  const { getDatabase, useDatabaseEmulator } = require("firebase/database");

  const db = getDatabase();
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
  const db = getDatabase();
  set(ref(db), null);
  // [END rtdb_emulator_flush]
}
