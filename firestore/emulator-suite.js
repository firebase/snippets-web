

export async function onDocumentReady(firebaseApp) {

  //[START fs_emulator_connect]
  // firebasApp previously initialized using firebase.initializeApp()
  const db = firebaseApp.firestore();
  if (location.hostname === "localhost") {
    db.settings({
      host: "localhost:8081",
      ssl: false
    });
  }
  // [END fs_emulator_connect]
}
