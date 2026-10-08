// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function signInWithEmailPassword() {
  // [START auth_signin_password]
  const { useActionState } = require("react");
  const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

  function SignInForm() {
    const [error, signIn, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, formData.get("email"), formData.get("password"));
        // Signed in
        const user = userCredential.user;
        // ...
        return null;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return errorMessage;
      }
    }, null);

    return (
      <form action={signIn}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit" disabled={isPending}>Sign in</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_signin_password]
}

function signUpWithEmailPassword() {
  // [START auth_signup_password]
  const { useActionState } = require("react");
  const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

  function SignUpForm() {
    const [error, signUp, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth, formData.get("email"), formData.get("password"));
        // Signed up
        const user = userCredential.user;
        // ...
        return null;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        return errorMessage;
      }
    }, null);

    return (
      <form action={signUp}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit" disabled={isPending}>Sign up</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_signup_password]
}

function sendEmailVerification() {
  // [START auth_send_email_verification]
  const { useTransition } = require("react");
  const { getAuth, sendEmailVerification } = require("firebase/auth");

  function VerifyEmailButton() {
    const [isPending, startTransition] = useTransition();

    function sendVerificationEmail() {
      startTransition(async () => {
        const auth = getAuth();
        await sendEmailVerification(auth.currentUser);
        // Email verification sent!
        // ...
      });
    }

    return <button onClick={sendVerificationEmail} disabled={isPending}>Verify email</button>;
  }
  // [END auth_send_email_verification]
}

function sendPasswordReset() {
  // [START auth_send_password_reset]
  const { useActionState } = require("react");
  const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

  function PasswordResetForm() {
    const [error, sendPasswordReset, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, formData.get("email"));
        // Password reset email sent!
        // ..
        return null;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        return errorMessage;
      }
    }, null);

    return (
      <form action={sendPasswordReset}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Reset password</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_send_password_reset]
}
