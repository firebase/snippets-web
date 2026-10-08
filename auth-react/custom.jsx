// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function signInCustom() {
  // [START auth_sign_in_custom]
  const { useTransition } = require("react");
  const { getAuth, signInWithCustomToken } = require("firebase/auth");

  function CustomTokenSignInButton({ token }) {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        const auth = getAuth();
        try {
          const userCredential = await signInWithCustomToken(auth, token);
          // Signed in
          const user = userCredential.user;
          // ...
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in</button>;
  }
  // [END auth_sign_in_custom]
}
