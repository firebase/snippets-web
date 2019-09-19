
function onDocumentReady() {

  //[START rtdb_emulator_connect]
  if (location.hostname === "localhost") {

    var firebaseConfig = {
      // Point to the RTDB emulator running on localhost.
      // In almost all cases the ns (namespace) is your project ID.
      databaseURL: "http://localhost:9000?ns=YOUR_DATABASE_NAMESPACE"
    }

    var myApp = firebase.initializeApp(firebaseConfig);
    var db = myApp.database();
  } 
  // [END rtdb_emulator_connect]
}

function flushRealtimeDatabase(firebase) {

  //[START rtdb_emulator_flush]
  // With a database Reference, write null to clear the database.
  firebase.database().ref().set(null);
  // [END rtdb_emulator_flush]
}
