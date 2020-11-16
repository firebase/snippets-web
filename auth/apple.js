// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/apple.md

function appleProvider() {
  // [START auth_apple_provider_create]
  var provider = new firebase.auth.OAuthProvider('apple.com');
  // [END auth_apple_provider_create]

  // [START auth_apple_provider_scopes]
  provider.addScope('email');
  provider.addScope('name');
  // [END auth_apple_provider_scopes]

  // [START auth_apple_provider_params]
  provider.setCustomParameters({
    // Localize the Apple authentication screen in French.
    locale: 'fr'
  });
  // [END auth_apple_provider_params]
}

function appleSignInPopup(provider) {
  // [START auth_apple_signin_popup]
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // The signed-in user info.
      var user = result.user;

      // You can also get the Apple OAuth Access and ID Tokens.
      var accessToken = credential.accessToken;
      var idToken = credential.idToken;

      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
  // [END auth_apple_signin_popup]
}

function appleSignInRedirect(provider) {
  // [START auth_apple_signin_redirect]
  firebase.auth().signInWithRedirect(provider);
  // [END auth_apple_signin_redirect]
}

function appleSignInRedirectResult() {
  // [START auth_apple_signin_redirect_result]
  // Result from Redirect auth flow.
  firebase
    .auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // You can get the Apple OAuth Access and ID Tokens.
        var accessToken = credential.accessToken;
        var idToken = credential.idToken;

        // ...
      }
      // The signed-in user info.
      var user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
  // [END auth_apple_signin_redirect_result]
}

function appleReauthenticatePopup() {
  // [START auth_apple_reauthenticate_popup]
  const provider = new firebase.auth.OAuthProvider('apple.com');

  firebase
    .auth()
    .currentUser
    .reauthenticateWithPopup(provider)
    .then((result) => {
      // User is re-authenticated with fresh tokens minted and can perform
      // sensitive operations like account deletion, or updating their email
      // address or password.
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      // The signed-in user info.
      var user = result.user;
       // You can also get the Apple OAuth Access and ID Tokens.
      var accessToken = credential.accessToken;
      var idToken = credential.idToken;
  
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
  
      // ...
    });
  // [END auth_apple_reauthenticate_popup]
}

function appleLinkFacebook() {
  // [START auth_apple_link_facebook]
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('user_birthday');

  // Assuming the current user is an Apple user linking a Facebook provider.
  firebase.auth().currentUser.linkWithPopup(provider)
      .then((result) => {
        // Facebook credential is linked to the current Apple user.
        // Facebook additional data available in result.additionalUserInfo.profile,
        // Additional Facebook OAuth access token can also be retrieved.
        // result.credential.accessToken
  
        // The user can now sign in to the same account
        // with either Apple or Facebook.
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_apple_link_facebook]
}

function appleNonceNode() {
  // [START auth_apple_nonce_node]
  const crypto = require("crypto");
  const string_decoder = require("string_decoder");

  // Generate a new random string for each sign-in
  const generateNonce = function(length) {
    const decoder = new string_decoder.StringDecoder("ascii");
    const buf = Buffer.alloc(length);
    var nonce = "";
    while (nonce.length < length) {
      crypto.randomFillSync(buf);
      nonce = decoder.write(buf);
    }
    return nonce.substr(0, length);
  };
  
  const unhashedNonce = generateNonce(10);

  // SHA256-hashed nonce in hex
  const hashedNonceHex = crypto.createHash('sha256')
    .update(unhashedNonce).digest().toString('hex');
  // [END auth_apple_nonce_node]
}

function appleSignInNonce(appleIdToken, unhashedNonce,) {
  // [START auth_apple_signin_nonce]
  // Build Firebase credential with the Apple ID token.
  const provider = new firebase.auth.OAuthProvider('apple.com');
  const authCredential = provider.credential({
    idToken: appleIdToken,
    rawNonce: unhashedNonce,
  });

  // Sign in with credential form the Apple user.
  firebase.auth().signInWithCredential(authCredential)
    .then((result) => {
      // User signed in.
    })
    .catch((error) => {
      // An error occurred. If error.code == 'auth/missing-or-invalid-nonce',
      // make sure you're sending the SHA256-hashed nonce as a hex string
      // with your request to Apple.
      console.log(error);
    });
  // [END auth_apple_signin_nonce]
}
