// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function facebookProvider() {
  // [START auth_facebook_provider_create]
  const { FacebookAuthProvider } = require("firebase/auth");

  const provider = new FacebookAuthProvider();
  // [END auth_facebook_provider_create]

  // / [START auth_facebook_provider_scopes]
  provider.addScope('user_birthday');
  // [END auth_facebook_provider_scopes]

  // [START auth_facebook_provider_params]
  provider.setCustomParameters({
    'display': 'popup'
  });
  // [END auth_facebook_provider_params]
}

function facebookSignInPopup(provider) {
  // [START auth_facebook_signin_popup]
  const { getAuth, signInWithPopup, FacebookAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithPopup(auth, provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
  // [END auth_facebook_signin_popup]
}

function facebookSignInRedirectResult() {
  // [START auth_facebook_signin_redirect_result]
  const { getAuth, getRedirectResult, FacebookAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_facebook_signin_redirect_result]
}

function checkLoginState_wrapper() {
  // See real implementation below
  function isUserEqual(x, y) {
    return true;
  }

  // [START auth_facebook_callback]
  const { getAuth, onAuthStateChanged, signInWithCredential, signOut, FacebookAuthProvider } = require("firebase/auth");
  const auth = getAuth(firebaseApp);

  function checkLoginState(response) {
    if (response.authResponse) {
      // User is signed-in Facebook.
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(response.authResponse, firebaseUser)) {
          // Build Firebase credential with the Facebook auth token.
          const credential = FacebookAuthProvider.credential(
              response.authResponse.accessToken);
          
          // Sign in with the credential from the Facebook user.
          signInWithCredential(auth, credential)
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.email;
              // The AuthCredential type that was used.
              const credential = FacebookAuthProvider.credentialFromError(error);
              // ...
            });
        } else {
          // User is already signed-in Firebase with the correct user.
        }
      });
    } else {
      // User is signed-out of Facebook.
      signOut(auth);
    }
  }
  // [END auth_facebook_callback]
}

function isUserEqual_wrapper() {
  // [START auth_facebook_checksameuser]
  const { FacebookAuthProvider } = require("firebase/auth");

  function isUserEqual(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === FacebookAuthProvider.PROVIDER_ID &&
            providerData[i].uid === facebookAuthResponse.userID) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }
  // [END auth_facebook_checksameuser]
}


function authWithCredential(credential) {
  // [START auth_facebook_signin_credential]
  const { getAuth, signInWithCredential, FacebookAuthProvider } = require("firebase/auth");

  // Sign in with the credential from the Facebook user.
  const auth = getAuth(firebaseApp);
  signInWithCredential(auth, credential)
    .then((result) => {
      // Signed in 
      const credential = FacebookAuthProvider.credentialFromResult(result);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_facebook_signin_credential]
}
