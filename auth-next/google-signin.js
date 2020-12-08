// [SNIPPETS_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/google-signin.md

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
    const credential = error.credential;
    // ...
  });
  // [END auth_google_build_signin]
}

function onSignIn_wrapper() {
  // See real implementation below
  function isUserEqual(x, y) {
    return true;
  }

  // [START auth_google_callback]
  const { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");
  const auth = getAuth();

  function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        const credential = GoogleAuthProvider.credential(
            googleUser.getAuthResponse().id_token);
    
        // Sign in with credential from the Google user.
        // [START auth_google_signin_credential]
        signInWithCredential(auth, credential).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          // ...
        });
        // [END auth_google_signin_credential]
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }
  // [END auth_google_callback]
}

function isUserEqual_wrapper() {
  // [START auth_google_checksameuser]
  const { GoogleAuthProvider } = require("firebase/auth");

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }
  // [END auth_google_checksameuser]
}


