// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

function getReference() {
  // [START rtdb_get_reference]
  var database = firebase.database();
  // [END rtdb_get_reference]
}
