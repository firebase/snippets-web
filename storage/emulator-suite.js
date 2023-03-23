// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/storage";

function onDocumentReady() {
  // [START storage_emulator_connect]
  var storage = firebase.storage();
  if (location.hostname === "localhost") {
    // Point to the Storage emulator running on localhost.
    storage.useEmulator("127.0.0.1", 9199);
  } 
  // [END storage_emulator_connect]
}

