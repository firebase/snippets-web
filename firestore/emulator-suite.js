
export async function onDocumentReady(firebaseApp) {

  //[START fs_emulator_connect]
  // firebaseApp previously initialized using firebase.initializeApp().
  // See <a href="https://firebase.google.com/docs/web/setup">Add Firebase to your JavaScript project</a>.
  var db = firebaseApp.firestore();
  if (location.hostname === "localhost") {
    // Note that the Firebase Web SDK must connect to the WebChannel port
    db.settings({
      host: "localhost:8081",
      ssl: false
    });
  }
  // [END fs_emulator_connect]
}
