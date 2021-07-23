// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function emulatorConnect() {
  // [START auth_emulator_connect]
  const { getAuth, connectAuthEmulator } = require("firebase/auth");

  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
  // [END auth_emulator_connect]
}

