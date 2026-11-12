// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function multipleInstances() {
  // [START rtdb_multiple_instances]
  const { initializeApp } = require("firebase/app");
  const { getDatabase } = require("firebase/database");

  // Initialize Firebase once at module scope (e.g. src/firebase.js), not inside a component.
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
