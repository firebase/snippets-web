// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function getUserProfile() {
  // [START auth_get_user_profile]
  const { getAuth } = require("firebase/auth");

  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;
  }
  // [END auth_get_user_profile]
}

function getUserProfileProvider() {
  // [START auth_get_user_profile_provider]
  const { getAuth } = require("firebase/auth");

  const auth = getAuth();
  const user = auth.currentUser;

  if (user !== null) {
    user.providerData.forEach((profile) => {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });
  }
  // [END auth_get_user_profile_provider]
}

function updateUserProfile() {
  // [START auth_update_user_profile]
  const { useActionState } = require("react");
  const { getAuth, updateProfile } = require("firebase/auth");

  function UpdateProfileForm() {
    const [error, updateUserProfile, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        await updateProfile(auth.currentUser, {
          displayName: formData.get("displayName"), photoURL: formData.get("photoURL")
        });
        // Profile updated!
        // ...
        return null;
      } catch (error) {
        // An error occurred
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={updateUserProfile}>
        <input name="displayName" />
        <input name="photoURL" type="url" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_update_user_profile]
}

function updateUserEmail() {
  // [START auth_update_user_email]
  const { useActionState } = require("react");
  const { getAuth, updateEmail } = require("firebase/auth");

  function UpdateEmailForm() {
    const [error, updateUserEmail, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();
      try {
        await updateEmail(auth.currentUser, formData.get("email"));
        // Email updated!
        // ...
        return null;
      } catch (error) {
        // An error occurred
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={updateUserEmail}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_update_user_email]
}

function sendEmailVerification() {
  // [START send_email_verification]
  const { getAuth, sendEmailVerification } = require("firebase/auth");

  function VerifyEmailButton() {
    async function sendVerificationEmail() {
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        await sendEmailVerification(user);
        // Email sent.
      } catch (error) {
        // An error ocurred
        // ...
      }
    }

    return <button onClick={sendVerificationEmail}>Verify email</button>;
  }
  // [END send_email_verification]
}

function updatePassword() {
  // [START auth_update_password]
  const { useActionState } = require("react");
  const { getAuth, updatePassword } = require("firebase/auth");

  function UpdatePasswordForm() {
    const [error, updateUserPassword, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();

      const user = auth.currentUser;
      const newPassword = formData.get("newPassword");

      try {
        await updatePassword(user, newPassword);
        // Update successful.
        return null;
      } catch (error) {
        // An error ocurred
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={updateUserPassword}>
        <input name="newPassword" type="password" />
        <button type="submit" disabled={isPending}>Save</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_update_password]
}

function sendPasswordReset() {
  // [START auth_send_password_reset]
  const { useActionState } = require("react");
  const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

  function PasswordResetForm() {
    const [error, sendPasswordReset, isPending] = useActionState(async (previousError, formData) => {
      const auth = getAuth();

      try {
        await sendPasswordResetEmail(auth, formData.get("emailAddress"));
        // Email sent.
        return null;
      } catch (error) {
        // An error ocurred
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={sendPasswordReset}>
        <input name="emailAddress" type="email" />
        <button type="submit" disabled={isPending}>Reset password</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_send_password_reset]
}

function deleteUser() {
  // [START auth_delete_user]
  const { getAuth, deleteUser } = require("firebase/auth");

  function DeleteUserButton() {
    async function deleteAccount() {
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        await deleteUser(user);
        // User deleted.
      } catch (error) {
        // An error ocurred
        // ...
      }
    }

    return <button onClick={deleteAccount}>Delete</button>;
  }
  // [END auth_delete_user]
}

function reauthenticateWithCredential() {
  /**
   * @returns {any}
   */
  function promptForCredentials() {
    return {};
  }

  // [START auth_reauth_with_credential]
  const { getAuth, reauthenticateWithCredential } = require("firebase/auth");

  function ReauthenticateButton() {
    async function reauthenticate() {
      const auth = getAuth();
      const user = auth.currentUser;

      // TODO(you): prompt the user to re-provide their sign-in credentials
      const credential = promptForCredentials();

      try {
        await reauthenticateWithCredential(user, credential);
        // User re-authenticated.
      } catch (error) {
        // An error ocurred
        // ...
      }
    }

    return <button onClick={reauthenticate}>Reauthenticate</button>;
  }
  // [END auth_reauth_with_credential]
}
