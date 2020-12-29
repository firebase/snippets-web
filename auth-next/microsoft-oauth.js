// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/microsoft-oauth.md

function msftCreateProvider() {
  // [START auth_msft_create_provider]
  const { OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('microsoft.com');
  // [END auth_msft_create_provider]

  // [START auth_msft_provider_scopes]
  provider.addScope('mail.read');
  provider.addScope('calendars.read');
  // [END auth_msft_provider_scopes]

  // [START auth_msft_provider_params]
  provider.setCustomParameters({
    // Force re-consent.
    prompt: 'consent',
    // Target specific email with login hint.
    login_hint: 'user@firstadd.onmicrosoft.com'
  });
  // [END auth_msft_provider_params]

  // [START auth_msft_provider_params_tenant]
  provider.setCustomParameters({
    // Optional "tenant" parameter in case you are using an Azure AD tenant.
    // eg. '8eaef023-2b34-4da1-9baa-8bc8c9d6a490' or 'contoso.onmicrosoft.com'
    // or "common" for tenant-independent tokens.
    // The default value is "common".
    tenant: 'TENANT_ID'
  });
  // [END auth_msft_provider_params_tenant]
}

function msftSignInPopup(provider) {
  // [START auth_msft_signin_popup]
  const { getAuth, signInWithPopup, OAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithPopup(auth, provider)
    .then((result) => {
      // User is signed in.
      // IdP data available in result.additionalUserInfo.profile.

      // Get the OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_msft_signin_popup]
}

function msftSignInRedirect(provider) {
  // [START auth_msft_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, provider);
  // [END auth_msft_signin_redirect]
}

function msftSignInRedirectResult() {
  // [START auth_msft_signin_redirect_result]
  const { getAuth, getRedirectResult, OAuthProvider } = require("firebase/auth");
    
  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      // User is signed in.
      // IdP data available in result.additionalUserInfo.profile.

      // Get the OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_msft_signin_redirect_result]
}

function msftLinkWithPopup() {
  // [START auth_msft_link_popup]
  const { getAuth, linkWithPopup, OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('microsoft.com');
  const auth = getAuth(firebaseApp);

  linkWithPopup(auth.currentUser, provider)
      .then((result) => {
        // Microsoft credential is linked to the current user.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_msft_link_popup]
}

function msftReauthPopup() {
  // [START auth_msft_reauth_popup]
  const { getAuth, reauthenticateWithPopup, OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('microsoft.com');
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
  // [END auth_msft_reauth_popup]
}
