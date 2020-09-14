const firebase = require('firebase');
require('firebase/firestore');

function onDocumentReady(firebaseApp) {
  //[START fs_emulator_connect]
  // Firebase previously initialized using firebase.initializeApp().
  var db = firebase.firestore();
  if (location.hostname === "localhost") {
    db.settings({
      host: "localhost:8080",
      ssl: false
    });
  }
  // [END fs_emulator_connect]
}
