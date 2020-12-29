// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function twitterProvider() {
  // [START auth_twitter_provider_create]
  const { TwitterAuthProvider } = require("firebase/auth");

  const provider = new TwitterAuthProvider();
  // [END auth_twitter_provider_create]

  // [START auth_twitter_provider_params]
  provider.setCustomParameters({
    'lang': 'es'
  });
  // [END auth_twitter_provider_params]
}

function twitterSignInPopup(provider) {
  // [START auth_twitter_signin_popup]
  const { getAuth, signInWithPopup, TwitterAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;

      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_twitter_signin_popup]
}

function twitterSignInRedirectResult() {
  // [START auth_twitter_signin_redirect_result]
  const { getAuth, getRedirectResult, TwitterAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;
      // ...

      // The signed-in user info.
      const user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_twitter_signin_redirect_result]
}

