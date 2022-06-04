// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function samlProvider() {
  // [START auth_saml_provider_create]
  const { SAMLAuthProvider } = require("firebase/auth");

  const provider = new SAMLAuthProvider("saml.myProvider");
  // [END auth_saml_provider_create]
}

function samlSignInPopup(provider) {
  // [START auth_saml_signin_popup]
  const { getAuth, signInWithPopup, SAMLAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User is signed in.
      // Provider data available from the result.user.getIdToken()
      // or from result.user.providerData
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = SAMLAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_saml_signin_popup]
}

function samlSignInRedirect(provider) {
  // [START auth_saml_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  const auth = getAuth();
  signInWithRedirect(auth, provider);
  // [END auth_saml_signin_redirect]
}

function samlSignInRedirectResult(provider) {
  // [START auth_saml_signin_redirect_result]
  const { getAuth, getRedirectResult, SAMLAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  getRedirectResult(auth)
    .then((result) => {
      // User is signed in.
      // Provider data available from the result.user.getIdToken()
      // or from result.user.providerData
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = SAMLAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_saml_signin_redirect_result]
}