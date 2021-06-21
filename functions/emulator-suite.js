import firebase from "firebase/compat/app";
import "firebase/compat/functions";

function emulatorSettings() {
  // [START fb_functions_emulator_connect]
  firebase.functions().useEmulator("localhost", 5001);
  // [END fb_functions_emulator_connect]
}
