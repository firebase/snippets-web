// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

function samlProvider() {
  // [START auth_saml_provider_create]
  const provider = new firebase.auth.SAMLAuthProvider('saml.myProvider');
  // [END auth_saml_provider_create]
}

function samlSignInPopup(provider) {
  // [START auth_saml_signin_popup]
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // User is signed in.
      // Identity provider data available in result.additionalUserInfo.profile,
      // or from the user's ID token obtained from result.user.getIdToken()
      // as an object in the firebase.sign_in_attributes custom claim
      // This is also available from result.user.getIdTokenResult()
      // idTokenResult.claims.firebase.sign_in_attributes.
    })
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END auth_saml_signin_popup]
}

function samlSignInRedirect(provider) {
  // [START auth_saml_signin_redirect]
  firebase.auth().signInWithRedirect(provider);
  // [END auth_saml_signin_redirect]
}

function samlSignInRedirectResult(provider) {
  // [START auth_saml_signin_redirect_result]
  firebase.auth().getRedirectResult()
    .then((result) => {
      // User is signed in.
      // Provider data available in result.additionalUserInfo.profile,
      // or from the user's ID token obtained from result.user.getIdToken()
      // as an object in the firebase.sign_in_attributes custom claim
      // This is also available from result.user.getIdTokenResult()
      // idTokenResult.claims.firebase.sign_in_attributes.
    }).catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END auth_saml_signin_redirect_result]
}

