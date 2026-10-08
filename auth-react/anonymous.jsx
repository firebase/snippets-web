// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function anonSignIn() {
  // [START auth_anon_sign_in]
  const { useTransition } = require("react");
  const { getAuth, signInAnonymously } = require("firebase/auth");

  function AnonymousSignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        const auth = getAuth();
        try {
          await signInAnonymously(auth);
          // Signed in..
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in anonymously</button>;
  }
  // [END auth_anon_sign_in]
}
