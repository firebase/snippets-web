// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

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

  const auth = getAuth();
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

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/v8/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  // [END auth_state_listener]
}

function currentUser() {
  // [START auth_current_user]
  const { getAuth } = require("firebase/auth");

  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    // ...
  } else {
    // No user is signed in.
  }
  // [END auth_current_user]
}

function setLanguageCode() {
  // [START auth_set_language_code]
  const { getAuth } = require("firebase/auth");

  const auth = getAuth();
  auth.languageCode = 'it';
  // To apply the default browser preference instead of explicitly setting it.
  // firebase.auth().useDeviceLanguage();
  // [END auth_set_language_code]
}

function authWithCredential(credential) {
  // [START auth_signin_credential]
  const { getAuth, signInWithCredential } = require("firebase/auth");

  // Sign in with the credential from the user.
  const auth = getAuth();
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
      const email = error.customData.email;
      // ...
    });
  // [END auth_signin_credential]
}

function signInRedirect(provider) {
  // [START auth_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth();
  signInWithRedirect(auth, provider);
  // [END auth_signin_redirect]
}

function initializeWithCustomDomain() {
  // [START auth_init_custom_domain]
  const { initializeApp } = require("firebase/app");

  const firebaseConfig = {
    apiKey: "...",
    // By default, authDomain is '[YOUR_APP].firebaseapp.com'.
    // You may replace it with a custom domain.
    authDomain: '[YOUR_CUSTOM_DOMAIN]'
  };
  const firebaseApp = initializeApp(firebaseConfig);
  // [END auth_init_custom_domain]
}
