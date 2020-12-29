// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// ==========================================================================================
// Docs: Snippets in this file are "general purpose" and are used on more than one docs page
// ==========================================================================================

function makeGoogleCredential(googleUser) {
  // [START auth_make_google_credential]
  const { GoogleAuthProvider } = require("firebase/auth");

  const credential = GoogleAuthProvider.credential(
    googleUser.getAuthResponse().id_token);
  // [END auth_make_google_credential]
}

function makeFacebookCredential(response) {
  // [START auth_make_facebook_credential]
  const { FacebookAuthProvider } = require("firebase/auth");

  const credential = FacebookAuthProvider.credential(
    response.authResponse.accessToken);
  // [END auth_make_facebook_credential]
}

function makeEmailCredential(email, password) {
  // [START auth_make_email_credential]
  const { EmailAuthProvider } = require("firebase/auth");
  
  const credential = EmailAuthProvider.credential(email, password);
  // [END auth_make_email_credential]
}

function signOut() {
  // [START auth_sign_out]
  const { getAuth, signOut } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  // [END auth_sign_out]
}

function authStateListener() {
  // [START auth_state_listener]
  const { getAuth, onAuthStateChanged } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  // [END auth_state_listener]
}

function setLanguageCode() {
  // [START auth_set_language_code]
  const { getAuth } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  auth.languageCode = 'it';
  // To apply the default browser preference instead of explicitly setting it.
  // firebase.auth().useDeviceLanguage();
  // [END auth_set_language_code]
}

function authWithCredential(credential) {
  // [START auth_signin_credential]
  const { getAuth, signInWithCredential } = require("firebase/auth");

  // Sign in with the credential from the user.
  const auth = getAuth(firebaseApp);
  signInWithCredential(auth, credential)
    .then((result) => {
      // Signed in 
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // ...
    });
  // [END auth_signin_credential]
}

function signInRedirect(provider) {
  // [START auth_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, provider);
  // [END auth_signin_redirect]
}
