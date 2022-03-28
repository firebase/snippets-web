// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

function getUserProfile() {
  // [START auth_get_user_profile]
  const user = firebase.auth().currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getIdToken() instead.
    const uid = user.uid;
  }
  // [END auth_get_user_profile]
}

function getUserProfileProvider() {
  // [START auth_get_user_profile_provider]
  const user = firebase.auth().currentUser;

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
  const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: "Jane Q. User",
    photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(() => {
    // Update successful
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });  
  // [END auth_update_user_profile]
}

function updateUserEmail() {
  // [START auth_update_user_email]
  const user = firebase.auth().currentUser;

  user.updateEmail("user@example.com").then(() => {
    // Update successful
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });
  // [END auth_update_user_email]
}

function sendEmailVerification() {
  // [START send_email_verification]
  const user = firebase.auth().currentUser;

  user.sendEmailVerification().then(() => {
    // Email sent.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  // [END send_email_verification]
}

function updatePassword() {
  function getASecureRandomPassword() {
    return "correcthorsebatterystaple";
  }

  // [START auth_update_password]
  const user = firebase.auth().currentUser;
  const newPassword = getASecureRandomPassword();

  user.updatePassword(newPassword).then(() => {
    // Update successful.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  // [END auth_update_password]
}

function sendPasswordReset() {
  // [START auth_send_password_reset]
  const auth = firebase.auth();
  const emailAddress = "user@example.com";

  auth.sendPasswordResetEmail(emailAddress).then(() => {
    // Email sent.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  // [END auth_send_password_reset]
}

function deleteUser() {
  // [START auth_delete_user]
  const user = firebase.auth().currentUser;

  user.delete().then(() => {
    // User deleted.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  // [END auth_delete_user]
}

function reauthenticateWithCredential() {
  /**
   * @returns {object}
   */
  function promptForCredentials() {
    return {};
  }

  // [START auth_reauth_with_credential]
  const user = firebase.auth().currentUser;

  // TODO(you): prompt the user to re-provide their sign-in credentials
  const credential = promptForCredentials();

  user.reauthenticateWithCredential(credential).then(() => {
    // User re-authenticated.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  // [END auth_reauth_with_credential]
}
