// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function getReference() {
  // [START rtdb_get_reference]
  const { getDatabase } = require("firebase/database");

  const database = getDatabase();
  // [END rtdb_get_reference]
}
