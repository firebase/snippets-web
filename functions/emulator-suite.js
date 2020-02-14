
function emulatorSettings() {

  // [START functions_emulator_connect]
  firebase.functions().useFunctionsEmulator("http://localhost:5001")
  // [END functions_emulator_connect]
}
