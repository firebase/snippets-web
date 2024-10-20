// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

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

async function updateUserProfile() {
  // [START auth_update_user_profile]
  const { getAuth, updateProfile } = require("firebase/auth");
  const auth = getAuth();
  try {
    await updateProfile(auth.currentUser, {
      displayName: "Jane Q. User",
      photoURL: "https://example.com/jane-q-user/profile.jpg",
    });
    // Profile updated!
    // ...
  } catch (error) {
    // An error occurred
    // ...
  }
  // [END auth_update_user_profile]
}

async function updateUserEmail() {
  // [START auth_update_user_email]
  const { getAuth, updateEmail } = require("firebase/auth");
  const auth = getAuth();
  try {
    await updateEmail(auth.currentUser, "user@example.com");
    // Email updated!
    // ...
  } catch (error) {
    // An error occurred
    // ...
  }
  // [END auth_update_user_email]
}

async function sendEmailVerification() {
  // [START send_email_verification]
  const { getAuth, sendEmailVerification } = require("firebase/auth");

  const auth = getAuth();
  const user = auth.currentUser;

  try {
    await sendEmailVerification(user);
    // Email sent.
  } catch (error) {
    // An error ocurred
    // ...
  }
  // [END send_email_verification]
}

async function updatePassword() {
  function getASecureRandomPassword() {
    return "correcthorsebatterystaple";
  }

  // [START auth_update_password]
  const { getAuth, updatePassword } = require("firebase/auth");

  const auth = getAuth();

  const user = auth.currentUser;
  const newPassword = getASecureRandomPassword();

  try {
    await updatePassword(user, newPassword);
    // Update successful.
  } catch (error) {
    // An error ocurred
    // ...
  }
  // [END auth_update_password]
}

async function sendPasswordReset() {
  // [START auth_send_password_reset]
  const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

  const auth = getAuth();
  const emailAddress = "user@example.com";

  try {
    await sendPasswordResetEmail(auth, emailAddress);
    // Email sent.
  } catch (error) {
    // An error ocurred
    // ...
  }
  // [END auth_send_password_reset]
}

async function deleteUser() {
  // [START auth_delete_user]
  const { getAuth, deleteUser } = require("firebase/auth");

  const auth = getAuth();
  const user = auth.currentUser;

  try {
    await deleteUser(user);
    // User deleted.
  } catch (error) {
    // An error ocurred
    // ...
  }
  // [END auth_delete_user]
}

async function reauthenticateWithCredential() {
  /**
   * @returns {object}
   */
  function promptForCredentials() {
    return {};
  }

  // [START auth_reauth_with_credential]
  const { getAuth, reauthenticateWithCredential } = require("firebase/auth");

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
  // [END auth_reauth_with_credential]
}
