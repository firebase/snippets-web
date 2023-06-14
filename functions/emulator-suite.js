import firebase from "firebase/app";
import "firebase/functions";

function emulatorSettings() {
  // [START fb_functions_emulator_connect]
  firebase.functions().useEmulator("127.0.0.1", 5001);
  // [END fb_functions_emulator_connect]
}
