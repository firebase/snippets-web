// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function emulatorConnect() {
  // [START auth_emulator_connect]
  const { getAuth, useAuthEmulator } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  useAuthEmulator(auth, "http://localhost:9099");
  // [END auth_emulator_connect]
}

