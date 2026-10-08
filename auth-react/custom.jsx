// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function signInCustom() {
  // [START auth_sign_in_custom]
  const { useActionState } = require("react");
  const { getAuth, signInWithCustomToken } = require("firebase/auth");

  function CustomTokenSignInForm() {
    const [error, signIn, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        const userCredential = await signInWithCustomToken(auth, formData.get("token"));
        // Signed in
        const user = userCredential.user;
        // ...
        return null;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        return errorMessage;
      }
    }, null);

    return (
      <form action={signIn}>
        <input name="token" />
        <button type="submit" disabled={isPending}>Sign in</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_sign_in_custom]
}
