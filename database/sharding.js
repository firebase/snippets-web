// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/database";

function multipleInstances() {
  // [START rtdb_multiple_instances]
  const app1 = firebase.initializeApp({
    databaseURL: "https://testapp-1234-1.firebaseio.com"
  });

  const app2 = firebase.initializeApp({
    databaseURL: "https://testapp-1234-2.firebaseio.com"
  }, 'app2');

  // Get the default database instance for an app1
  var database1 = firebase.database();

  // Get a database instance for app2
  var database2 = firebase.database(app2);
  // [END rtdb_multiple_instances]
}
