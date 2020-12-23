
// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

function onDocumentReady() {
  // [START rtdb_emulator_connect]
  var db = firebase.database();
  if (location.hostname === "localhost") {
    // Point to the RTDB emulator running on localhost.
    db.useEmulator("localhost", 9000);
  } 
  // [END rtdb_emulator_connect]
}

function flushRealtimeDatabase() {
  // [START rtdb_emulator_flush]
  // With a database Reference, write null to clear the database.
  firebase.database().ref().set(null);
  // [END rtdb_emulator_flush]
}
