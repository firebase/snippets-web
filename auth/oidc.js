// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function oidcProvider() {
  // [START auth_oidc_provider_create]
  const provider = new firebase.auth.OAuthProvider('oidc.myProvider');
  // [END auth_oidc_provider_create]
}

function oidcSignInPopup(provider) {
  // [START auth_oidc_signin_popup]
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // result.credential is a firebase.auth.OAuthCredential object.
      // result.credential.providerId is equal to 'oidc.myProvider'.
      // result.credential.idToken is the OIDC provider's ID token.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_oidc_signin_popup]
}

function oidcSignInRedirect(provider) {
  // [START auth_oidc_signin_redirect]
  firebase.auth().signInWithRedirect(provider).catch((error) => {
    // Handle error.
  });
  // [END auth_oidc_signin_redirect]
}

function oidcSignInRedirectResult(provider) {
  // [START auth_oidc_signin_redirect_result]
  // On return.
  firebase.auth().getRedirectResult()
    .then((result) => {
      // result.credential is a firebase.auth.OAuthCredential object.
      // result.credential.providerId is equal to 'oidc.myProvider'.
      // result.credential.idToken is the OIDC provider's ID token.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_oidc_signin_redirect_result]
}

function oidcDirectSignIn(provider, oidcIdToken) {
  // [START auth_oidc_direct_sign_in]
  const credential = provider.credential(oidcIdToken, null);

  firebase.auth().signInWithCredential(credential)
    .then((result) => {
      // user now has a odic.myProvider UserInfo in providerData.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_oidc_direct_sign_in]
}

