// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function onDocumentReady() {
  // [START fs_emulator_connect]
  const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore");

  // firebaseApps previously initialized using initializeApp()
  const db = getFirestore();
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  // [END fs_emulator_connect]
}
