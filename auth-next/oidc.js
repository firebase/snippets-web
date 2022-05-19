// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function oidcProvider() {
  // [START auth_oidc_provider_create]
  const { OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider("oidc.myProvider");
  // [END auth_oidc_provider_create]
}

function oidcSignInPopup(provider) {
  // [START auth_oidc_signin_popup]
  const { getAuth, signInWithPopup, OAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User is signed in.
      const credential = OAuthProvider.credentialFromResult(result);
      // This gives you an access token for the OIDC provider. You can use it to directly interact with that provider
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_oidc_signin_popup]
}

function oidcSignInRedirect(provider) {
  // [START auth_oidc_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth();
  signInWithRedirect(auth, provider);
  // [END auth_oidc_signin_redirect]
}

function oidcSignInRedirectResult(provider) {
  // [START auth_oidc_signin_redirect_result]
  const { getAuth, getRedirectResult, OAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  getRedirectResult(auth)
    .then((result) => {
      // User is signed in.
      const credential = OAuthProvider.credentialFromResult(result);
      // This gives you an access token for the OIDC provider. You can use it to directly interact with that provider
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_oidc_signin_redirect_result]
}

function oidcDirectSignIn(provider, oidcIdToken) {
  // [START auth_oidc_direct_sign_in]
  const { getAuth, OAuthProvider, signInWithCredential } = require("firebase/auth");

  const auth = getAuth();
  const credential = provider.credential({
    idToken: oidcIdToken,
  });
  signInWithCredential(auth, credential)
    .then((result) => {
      // User is signed in.
      const newCredential = OAuthProvider.credentialFromResult(result);
      // This gives you a new access token for the OIDC provider. You can use it to directly interact with that provider.
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_oidc_direct_sign_in]
}