// [SNIPPETS_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function signInCustom() {
  const token = "token123";

  // [START auth_sign_in_custom]
  const { getAuth, signInWithCustomToken } = require("firebase/auth");

  const auth = getAuth();
  signInWithCustomToken(auth, token)
    .then((user) => {
      // Signed in
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    })
  // [END auth_sign_in_custom]
}
