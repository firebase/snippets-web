// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/email-link-auth.md

function emailLinkActionCodeSettings() {
  // [START auth_email_link_actioncode_settings]
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    // The domain must be configured in Firebase Hosting and owned by the project.
    linkDomain: 'custom-domain.com'
  };
  // [END auth_email_link_actioncode_settings]
}

function emailLinkSend(actionCodeSettings) {
  // [START auth_email_link_send]
  const { useActionState } = require("react");
  const { getAuth, sendSignInLinkToEmail } = require("firebase/auth");

  function SendSignInLinkForm() {
    const [error, sendSignInLink, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      const email = formData.get("email");
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
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
      <form action={sendSignInLink}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Send sign-in link</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_email_link_send]
}

function emailLinkComplete() {
  // [START email_link_complete]
  const { useEffect, useState } = require("react");
  const { getAuth, isSignInWithEmailLink, signInWithEmailLink } = require("firebase/auth");

  function EmailLinkSignIn() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      // Confirm the link is a sign-in with email link.
      const auth = getAuth();
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt('Please provide your email for confirmation');
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user by importing getAdditionalUserInfo
            // and calling it with result:
            // getAdditionalUserInfo(result)
            // You can access the user's profile via:
            // getAdditionalUserInfo(result)?.profile
            // You can check if the user is new or existing:
            // getAdditionalUserInfo(result)?.isNewUser
            setUser(result.user);
          })
          .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
    }, []);

    return user ? <p>Signed in as {user.email}</p> : <p>Signing in...</p>;
  }
  // [END email_link_complete]
}

function emailLinkLink() {
  // [START auth_email_link_link]
  const { useActionState } = require("react");
  const { getAuth, linkWithCredential, EmailAuthProvider } = require("firebase/auth");

  function LinkEmailForm() {
    const [error, linkEmail, isPending] = useActionState(async (previousError, formData) => {
      // Construct the email link credential from the current URL.
      const credential = EmailAuthProvider.credentialWithLink(
        formData.get("email"), window.location.href);

      // Link the credential to the current user.
      const auth = getAuth();
      try {
        const usercred = await linkWithCredential(auth.currentUser, credential);
        // The provider is now successfully linked.
        // The phone user can now sign in with their phone number or email.
        return null;
      } catch (error) {
        // Some error occurred.
        return error.message;
      }
    }, null);

    return (
      <form action={linkEmail}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Link email</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_email_link_link]
}

function emailLinkReauth() {
  // [START auth_email_link_reauth]
  const { useActionState } = require("react");
  const { getAuth, reauthenticateWithCredential, EmailAuthProvider } = require("firebase/auth");

  function ReauthenticateForm() {
    const [error, reauthenticate, isPending] = useActionState(async (previousError, formData) => {
      // Construct the email link credential from the current URL.
      const credential = EmailAuthProvider.credentialWithLink(
        formData.get("email"), window.location.href);

      // Re-authenticate the user with this credential.
      const auth = getAuth();
      try {
        const usercred = await reauthenticateWithCredential(auth.currentUser, credential);
        // The user is now successfully re-authenticated and can execute sensitive
        // operations.
        return null;
      } catch (error) {
        // Some error occurred.
        return error.message;
      }
    }, null);

    return (
      <form action={reauthenticate}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Reauthenticate with email</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_email_link_reauth]
}

function emailLinkDifferentiate() {
  // [START email_link_diferentiate]
  const { useActionState } = require("react");
  const { getAuth, fetchSignInMethodsForEmail, EmailAuthProvider} = require("firebase/auth");

  function SignInMethodsForm() {
    const [error, checkSignInMethods, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        // After asking the user for their email.
        const signInMethods = await fetchSignInMethodsForEmail(auth, formData.get("email"));
        // This returns the same array as fetchProvidersForEmail but for email
        // provider identified by 'password' string, signInMethods would contain 2
        // different strings:
        // 'emailLink' if the user previously signed in with an email/link
        // 'password' if the user has a password.
        // A user could have both.
        if (signInMethods.indexOf(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
          // User can sign in with email/password.
        }
        if (signInMethods.indexOf(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
          // User can sign in with email/link.
        }
        return null;
      } catch (error) {
        // Some error occurred, you can inspect the code: error.code
        return error.message;
      }
    }, null);

    return (
      <form action={checkSignInMethods}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Continue</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END email_link_diferentiate]
}
