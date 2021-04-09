// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function signInCustom() {
  const token = "token123";

  // [START auth_sign_in_custom]
  const { getAuth, signInWithCustomToken } = require("firebase/auth");

  const auth = getAuth();
  signInWithCustomToken(auth, token)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  // [END auth_sign_in_custom]
}
