import firebase from "firebase/app";
import "firebase/auth";

function emulatorConnect() {
  // [START auth_emulator_connect]
  var auth = firebase.auth();
  auth.useEmulator("http://localhost:9099");
  // [END auth_emulator_connect]
}
