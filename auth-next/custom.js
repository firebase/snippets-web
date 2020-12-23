// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function signInCustom() {
  const token = "token123";

  // [START auth_sign_in_custom]
  const { getAuth, signInWithCustomToken } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithCustomToken(auth, token)
    .then((user) => {
      // Signed in
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  // [END auth_sign_in_custom]
}
