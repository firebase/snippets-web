// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function emulatorConnect() {
  // [START auth_emulator_connect]
  const { getAuth, connectAuthEmulator } = require("firebase/auth");

  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
  // [END auth_emulator_connect]
}

function emulatorGoogleCredential() {
  // [START auth_emulator_google_credential]
  const { getAuth, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  signInWithCredential(auth, GoogleAuthProvider.credential(
    '{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'
  ));  
  // [END auth_emulator_google_credential]
}


