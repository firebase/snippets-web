// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/google-signin.md

function googleProvider() {
  // [START auth_google_provider_create]
  const { GoogleAuthProvider } = require("firebase/auth");

  const provider = new GoogleAuthProvider();
  // [END auth_google_provider_create]

  // [START auth_google_provider_scopes]
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  // [END auth_google_provider_scopes]
  
  // [START auth_google_provider_params]
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });
  // [END auth_google_provider_params]
}

function googleSignInPopup(provider) {
  // [START auth_google_signin_popup]
  const { getAuth, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");
  
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
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
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_google_signin_popup]
}

function googleSignInRedirectResult() {
  // [START auth_google_signin_redirect_result]
  const { getAuth, getRedirectResult, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_google_signin_redirect_result]
}

function googleBuildAndSignIn(id_token) {
  // [START auth_google_build_signin]
  const { getAuth, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");

  // Build Firebase credential with the Google ID token.
  const credential = GoogleAuthProvider.credential(id_token);

  // Sign in with credential from the Google user.
  const auth = getAuth();
  signInWithCredential(auth, credential).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  // [END auth_google_build_signin]
}

function onSignIn_wrapper() {

  // [START auth_google_callback]
  const { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");
  const auth = getAuth();

  function onSignIn(googleResponse) {
    console.log('Sign in with Google response', googleResponse);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      // Build Firebase credential with the Google ID token.
      const googleIdToken = googleResponse.credential;
      const credential = GoogleAuthProvider.credential(googleIdToken);
  
      // Sign in with credential from the Google user.
      // [START auth_google_signin_credential]
      signInWithCredential(auth, credential).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      // [END auth_google_signin_credential]
    });
  }
  // [END auth_google_callback]
}

function googleProviderCredential(idToken) {
  // [START auth_google_provider_credential]
  const { GoogleAuthProvider } = require("firebase/auth");

  const credential = GoogleAuthProvider.credential(idToken);
  // [END auth_google_provider_credential]
}



