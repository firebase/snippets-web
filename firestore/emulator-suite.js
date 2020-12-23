import firebase from "firebase/app";
import 'firebase/firestore';

function onDocumentReady() {
  // [START fs_emulator_connect]
  // Firebase previously initialized using firebase.initializeApp().
  var db = firebase.firestore();
  if (location.hostname === "localhost") {
    db.useEmulator("localhost", 8080);
  }
  // [END fs_emulator_connect]
}
