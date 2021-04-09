// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function anonSignIn() {
  // [START auth_anon_sign_in]
  const { getAuth, signInAnonymously } = require("firebase/auth");

  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  // [END auth_anon_sign_in]
}
