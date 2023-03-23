// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function onDocumentReady() {
  // [START storage_emulator_connect]
  const { getStorage, connectStorageEmulator } = require("firebase/storage");

  const storage = getStorage();
  if (location.hostname === "localhost") {
    // Point to the Storage emulator running on localhost.
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  } 
  // [END storage_emulator_connect]
}
