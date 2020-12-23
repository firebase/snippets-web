// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/cordova.md

function createGoogleProvider() {
  // [START auth_create_google_provider]
  const { GoogleAuthProvider } = require("firebase/auth");

  const provider = new GoogleAuthProvider();
  // [END auth_create_google_provider]
}

function cordovaSignInRedirect() {
  // [START auth_cordova_sign_in_redirect]
  const { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, new GoogleAuthProvider())
    .then(() => {
      return getRedirectResult(auth);
    })
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // This gives you a Google Access Token.
      // You can use it to access the Google API.
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  // [END auth_cordova_sign_in_redirect]
}

function cordovaRedirectResult() {
  // [START auth_cordova_redirect_result]
  const { getAuth, getRedirectResult, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {        
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  // [END auth_cordova_redirect_result]
}
