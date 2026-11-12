// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/custom-email-handler.md

function handleUserManagementQueryParams() {
  // TODO: This helpers should be implemented by the developer
  function getParameterByName(name) {
    return "";
  }

  // The handler components are defined in the snippets below.
  function ResetPasswordForm(props) { return null; }
  function EmailRecovery(props) { return null; }
  function EmailVerification(props) { return null; }

  // [START auth_handle_mgmt_query_params]
  const { initializeApp } = require("firebase/app");
  const { getAuth } = require("firebase/auth");

  // Configure the Firebase SDK.
  // This is the minimum configuration required for the API to be used.
  const config = {
    'apiKey': "YOUR_API_KEY" // Copy this key from the web initialization
                             // snippet found in the Firebase console.
  };
  // Initialize Firebase once at module scope (e.g. src/firebase.js), not inside a component.
  const app = initializeApp(config);
  const auth = getAuth(app);

  function EmailActionHandler() {
    // TODO: Implement getParameterByName()

    // Get the action to complete.
    const mode = getParameterByName('mode');
    // Get the one-time code from the query parameter.
    const actionCode = getParameterByName('oobCode');
    // (Optional) Get the continue URL from the query parameter if available.
    const continueUrl = getParameterByName('continueUrl');
    // (Optional) Get the language code if available.
    const lang = getParameterByName('lang') || 'en';

    // Handle the user management action.
    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        return <ResetPasswordForm actionCode={actionCode} continueUrl={continueUrl} lang={lang} />;
      case 'recoverEmail':
        // Display email recovery handler and UI.
        return <EmailRecovery actionCode={actionCode} lang={lang} />;
      case 'verifyEmail':
        // Display email verification handler and UI.
        return <EmailVerification actionCode={actionCode} continueUrl={continueUrl} lang={lang} />;
      default:
        // Error: invalid mode.
        return null;
    }
  }
  // [END auth_handle_mgmt_query_params]
}

function handleResetPassword(auth) {
  // [START auth_handle_reset_password]
  const { useEffect, useState, useActionState } = require("react");
  const { verifyPasswordResetCode, confirmPasswordReset } = require("firebase/auth");

  function ResetPasswordForm({ actionCode, continueUrl, lang }) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    const [accountEmail, setAccountEmail] = useState(null);

    useEffect(() => {
      let ignore = false;
      // Verify the password reset code is valid.
      verifyPasswordResetCode(auth, actionCode).then((email) => {
        if (ignore) return;
        // Show the reset screen with the user's email and ask the user for
        // the new password.
        setAccountEmail(email);
      }).catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
      });
      // Ignore the result if actionCode changes before the read completes.
      return () => { ignore = true; };
    }, [actionCode]);

    const [error, resetPassword, isPending] = useActionState(async (previousError, formData) => {
      const newPassword = formData.get("newPassword");

      try {
        // Save the new password.
        await confirmPasswordReset(auth, actionCode, newPassword);
        // Password reset has been confirmed and new password updated.

        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword);

        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
        return null;
      } catch (error) {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        return error.message;
      }
    }, null);

    return accountEmail ? (
      <form action={resetPassword}>
        <p>{accountEmail}</p>
        <input name="newPassword" type="password" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    ) : (
      <p>Loading...</p>
    );
  }
  // [END auth_handle_reset_password]
}

function handleRecoverEmail(auth) {
  // [START auth_handle_recover_email]
  const { useEffect, useState } = require("react");
  const { checkActionCode, applyActionCode, sendPasswordResetEmail } = require("firebase/auth");

  function EmailRecovery({ actionCode, lang }) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    const [restoredEmail, setRestoredEmail] = useState(null);

    useEffect(() => {
      let ignore = false;
      let restoredEmail = null;
      // Confirm the action code is valid.
      checkActionCode(auth, actionCode).then((info) => {
        // Get the restored email address.
        restoredEmail = info['data']['email'];

        // Revert to the old email.
        return applyActionCode(auth, actionCode);
      }).then(() => {
        if (ignore) return;
        // Account email reverted to restoredEmail
        setRestoredEmail(restoredEmail);

        // You might also want to give the user the option to reset their password
        // in case the account was compromised:
        sendPasswordResetEmail(auth, restoredEmail).then(() => {
          // Password reset confirmation sent. Ask user to check their email.
        }).catch((error) => {
          // Error encountered while sending password reset code.
        });
      }).catch((error) => {
        // Invalid code.
      });
      // Ignore the result if actionCode changes before the read completes.
      return () => { ignore = true; };
    }, [actionCode]);

    // Display a confirmation message to the user.
    return restoredEmail ? <p>Account email reverted to {restoredEmail}</p> : <p>Loading...</p>;
  }
  // [END auth_handle_recover_email]
}

function handleVerifyEmail(auth) {
  // [START auth_handle_verify_email]
  const { useEffect, useState } = require("react");
  const { applyActionCode } = require("firebase/auth");

  function EmailVerification({ actionCode, continueUrl, lang }) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      let ignore = false;
      // Try to apply the email verification code.
      applyActionCode(auth, actionCode).then((resp) => {
        if (ignore) return;
        // Email address has been verified.
        setVerified(true);

        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      }).catch((error) => {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
      });
      // Ignore the result if actionCode changes before the read completes.
      return () => { ignore = true; };
    }, [actionCode]);

    // Display a confirmation message to the user.
    // You could also provide the user with a link back to the app.
    return verified ? <p>Email address has been verified.</p> : <p>Verifying...</p>;
  }
  // [END auth_handle_verify_email]
}
