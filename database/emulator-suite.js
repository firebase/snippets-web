

export async function onDocumentReady() {

  //[START rtdb_emulator_connect]
  let firebaseConfig = {
    // Point to the RTDB emulator running on localhost.
    // Here we supply database namespace 'foo'.
    databaseURL: "http://localhost:9000?ns=foo"
  }

  var myApp = firebase.initializeApp(firebaseConfig);
  const db = myApp.database();
  // [END rtdb_emulator_connect]
}
