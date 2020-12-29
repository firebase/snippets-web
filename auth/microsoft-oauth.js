// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/microsoft-oauth.md

function microsoftProvider() {
  // [START auth_msft_provider_create]
  var provider = new firebase.auth.OAuthProvider('microsoft.com');
  // [END auth_msft_provider_create]

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
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // IdP data available in result.additionalUserInfo.profile.
      // ...

      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // OAuth access and id tokens can also be retrieved:
      var accessToken = credential.accessToken;
      var idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_msft_signin_popup]
}

function msftSignInRedirect(provider) {
  // [START auth_msft_signin_redirect]
  firebase.auth().signInWithRedirect(provider);
  // [END auth_msft_signin_redirect]
}

function msftSignInRedirectResult() {
  // [START auth_msft_signin_redirect_result]
  firebase.auth().getRedirectResult()
    .then((result) => {
      // IdP data available in result.additionalUserInfo.profile.
      // ...

      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // OAuth access and id tokens can also be retrieved:
      var accessToken = credential.accessToken;
      var idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_msft_signin_redirect_result]
}

function msftLinkWithPopup() {
  // [START auth_msft_link_popup]
  var provider = new firebase.auth.OAuthProvider('microsoft.com');
  firebase.auth().currentUser.linkWithPopup(provider)
      .then((result) => {
        // Microsoft credential is linked to the current user.
        // IdP data available in result.additionalUserInfo.profile.
        // OAuth access token can also be retrieved:
        // result.credential.accessToken
        // OAuth ID token can also be retrieved:
        // result.credential.idToken
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_msft_link_popup]
}

function msftReauthPopup() {
  // [START auth_msft_reauth_popup]
  var provider = new firebase.auth.OAuthProvider('microsoft.com');
  firebase.auth().currentUser.reauthenticateWithPopup(provider)
      .then((result) => {
        // User is re-authenticated with fresh tokens minted and
        // should be able to perform sensitive operations like account
        // deletion and email or password update.
        // IdP data available in result.additionalUserInfo.profile.
        // OAuth access token can also be retrieved:
        // result.credential.accessToken
        // OAuth ID token can also be retrieved:
        // result.credential.idToken
      })
      .catch((error) => {
        // Handle error.
      });
  // [END auth_msft_reauth_popup]
}
