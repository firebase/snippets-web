// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function emulatorConnect() {
  // [START auth_emulator_connect]
  const { getAuth, connectAuthEmulator } = require("firebase/auth");

  const auth = getAuth();
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  // [END auth_emulator_connect]
}

function emulatorGoogleCredential() {
  // [START auth_emulator_google_credential]
  const { getAuth, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      await signInWithCredential(auth, GoogleAuthProvider.credential(
        '{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'
      ));
    }

    return <button onClick={signIn}>Sign in with Google</button>;
  }
  // [END auth_emulator_google_credential]
}
