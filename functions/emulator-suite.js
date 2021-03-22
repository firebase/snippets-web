import firebase from "firebase/app";
import "firebase/functions";

function emulatorSettings() {
  // [START fb_functions_emulator_connect]
  firebase.functions().useEmulator("localhost", 5001);
  // [END fb_functions_emulator_connect]
}
