// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function onDocumentReady() {
  // [START storage_emulator_connect]
  const { getStorage, connectStorageEmulator } = require("firebase/storage");

  const storage = getStorage();
  if (location.hostname === "localhost") {
    // Point to the RTDB emulator running on localhost.
    connectStorageEmulator(storage, "localhost", 9199);
  } 
  // [END storage_emulator_connect]
