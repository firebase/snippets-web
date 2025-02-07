// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

async function anonSignIn() {
  // [START auth_anon_sign_in]
  const { getAuth, signInAnonymously } = require("firebase/auth");

  const auth = getAuth();
  try {
    await signInAnonymously(auth);
    // Signed in..
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  }
  // [END auth_anon_sign_in]
}
