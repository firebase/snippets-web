// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function onDocumentReady() {
  // [START fs_emulator_connect]
  const { getFirestore, useFirestoreEmulator } = require("firebase/firestore");

  // firebaseApps previously initialized using initializeApp()
  const db = getFirestore();
  useFirestoreEmulator(db, 'localhost', 8080);
  // [END fs_emulator_connect]
}
