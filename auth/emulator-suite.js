import firebase from "firebase/app";
import "firebase/auth";

function emulatorConnect() {
  // [START auth_emulator_connect]
  const auth = firebase.auth();
  auth.useEmulator("http://localhost:9099");
  // [END auth_emulator_connect]
}

function emulatorGoogleCredential() {
  // [START auth_emulator_google_credential]
  const auth = firebase.auth();
  auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(
    '{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'
  ));  
  // [END auth_emulator_google_credential]
}
