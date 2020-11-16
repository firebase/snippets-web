// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/cordova.md

function createGoogleProvider() {
  // [START auth_create_google_provider]
  var provider = new firebase.auth.GoogleAuthProvider();
  // [END auth_create_google_provider]
}

function cordovaSignInRedirect(provider) {
  // [START auth_cordova_sign_in_redirect]
  firebase.auth().signInWithRedirect(provider).then(function() {
    return firebase.auth().getRedirectResult();
  }).then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token.
    // You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  // [END auth_cordova_sign_in_redirect]
}

function cordovaRedirectResult() {
  // [START auth_cordova_redirect_result]
  firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      
      // This gives you a Google Access Token.
      // You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  // [END auth_cordova_redirect_result]
}
