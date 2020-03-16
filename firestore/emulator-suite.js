
function onDocumentReady(firebaseApp) {

  //[START fs_emulator_connect]
  // firebaseApp previously initialized using firebase.initializeApp().
  var db = firebaseApp.firestore();
  if (location.hostname === "localhost") {
    db.settings({
      host: "localhost:8080",
      ssl: false
    });
  }
  // [END fs_emulator_connect]
}
