// [SNIPPETS_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import firebase from "firebase/app";
import "firebase/auth";

function checkLoginState_wrapper() {
  // See real implementation below
  function isUserEqual(x, y) {
    return true;
  }

  // [START auth_facebook_callback]
  const { getAuth, onAuthStateChanged, signInWithCredential, signOut, FacebookAuthProvider } = require("firebase/auth");
  const auth = getAuth();

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
          // [START auth_facebook_signin_credential]
          signInWithCredential(auth, credential)
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.email;
              // The AuthCredential type that was used.
              const credential = error.credential;
              // ...
            });
          // [END auth_facebook_signin_credential]
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
  const { getAuth, signInWithCredential } = require("firebase/auth");

  // Sign in with the credential from the Facebook user.
  const auth = getAuth();
  signInWithCredential(auth, credential)
    .then((cred) => {
      // Signed in 
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  // [END auth_facebook_signin_credential]
}
