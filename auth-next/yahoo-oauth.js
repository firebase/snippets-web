// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/yahoo-oauth.md

function yahooProvider() {
  // [START auth_yahoo_provider_create]
  const { OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('yahoo.com');
  // [END auth_yahoo_provider_create]

  // [START auth_yahoo_provider_scopes]
  // Request access to Yahoo Mail API.
  provider.addScope('mail-r');
  // Request read/write access to user contacts.
  // This must be preconfigured in the app's API permissions.
  provider.addScope('sdct-w');
  // [END auth_yahoo_provider_scopes]

  // [START auth_yahoo_provider_params]
  provider.setCustomParameters({
    // Prompt user to re-authenticate to Yahoo.
    prompt: 'login',
    // Localize to French.
    language: 'fr'
  });  
  // [END auth_yahoo_provider_params]
}

function yahooSignInPopup(provider) {
  // [START auth_yahoo_signin_popup]
  const { getAuth, signInWithPopup, OAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithPopup(auth, provider)
    .then((result) => {
      // IdP data available in result.additionalUserInfo.profile
      // ...

      // Yahoo OAuth access token and ID token can be retrieved by calling:
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_yahoo_signin_popup]
}

function yahooSignInRedirect(provider) {
  // [START auth_yahoo_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, provider);
  // [END auth_yahoo_signin_redirect]
}

function yahooSigninRedirectResult() {
  // [START auth_yahoo_signin_redirect_result]
  const { getAuth, getRedirectResult, OAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      // IdP data available in result.additionalUserInfo.profile
      // ...

      // Yahoo OAuth access token and ID token can be retrieved by calling:
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_yahoo_signin_redirect_result]
}

function yahooLinkPopup() {
  // [START auth_yahoo_link_popup]
  const { getAuth, linkWithPopup, OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('yahoo.com');
  const auth = getAuth(firebaseApp);
  linkWithPopup(auth.currentUser, provider)
      .then((result) => {
        // Yahoo credential is linked to the current user.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_yahoo_link_popup]
}

function yahooReauthPopup() {
  // [START auth_yahoo_reauth_popup]
  const { getAuth, reauthenticateWithPopup, OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('yahoo.com');
  const auth = getAuth(firebaseApp);
  reauthenticateWithPopup(auth.currentUser, provider)
      .then((result) => {
        // User is re-authenticated with fresh tokens minted and
        // should be able to perform sensitive operations like account
        // deletion and email or password update.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_yahoo_reauth_popup]
}
