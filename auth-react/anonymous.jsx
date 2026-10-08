// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function anonSignIn() {
  // [START auth_anon_sign_in]
  const { getAuth, signInAnonymously } = require("firebase/auth");

  function AnonymousSignInButton() {
    async function signIn() {
      const auth = getAuth();
      try {
        await signInAnonymously(auth);
        // Signed in..
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      }
    }

    return <button onClick={signIn}>Sign in anonymously</button>;
  }
  // [END auth_anon_sign_in]
}
