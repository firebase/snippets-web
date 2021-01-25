// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

function multipleInstances() {
  // [START rtdb_multiple_instances]
  const { initializeApp } = require("firebase/app");
  const { getDatabase } = require("firebase/database");

  const app1 = initializeApp({
    databaseURL: "https://testapp-1234-1.firebaseio.com"
  });

  const app2 = initializeApp({
    databaseURL: "https://testapp-1234-2.firebaseio.com"
  }, 'app2');

  // Get the default database instance for an app1
  const database1 = getDatabase(app1);

  // Get a database instance for app2
  const database2 = getDatabase(app2);
  // [END rtdb_multiple_instances]
}
