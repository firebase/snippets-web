// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function getReference() {
  // [START rtdb_get_reference]
  const { getDatabase } = require("firebase/database");

  const database = getDatabase(firebaseApp);
  // [END rtdb_get_reference]
}
