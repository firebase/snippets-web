const { initializeFirestore } = require("firebase/firestore");

function onDocumentReady(firebaseApp) {
  //[START fs_emulator_connect]
  let settings = {};
  if (location.hostname === "localhost") {
    settings = {
      host: "localhost:8080",
      ssl: false
    };
  }

  // firebaseApps previously initialized using initializeApp()
  const db = initializeFirestore(firebaseApp, settings);
  // [END fs_emulator_connect]
}
