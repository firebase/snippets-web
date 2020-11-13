// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/email-link-auth.md

function emailLinkActionCodeSettings() {
  // [START auth_email_link_actioncode_settings]
  var actionCodeSettings = {
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
    dynamicLinkDomain: 'example.page.link'
  };
  // [END auth_email_link_actioncode_settings]
}

function emailLinkSend(email, actionCodeSettings) {
  // [START auth_email_link_send]
  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  // [END auth_email_link_send]
}

function emailLinkComplete() {
  // [START email_link_complete]
  // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }
  // [END email_link_complete]
}

function emailLinkLink(email) {
  // [START auth_email_link_link]
  // Construct the email link credential from the current URL.
  var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
    email, window.location.href);

  // Link the credential to the current user.
  firebase.auth().currentUser.linkWithCredential(credential)
    .then((usercred) => {
      // The provider is now successfully linked.
      // The phone user can now sign in with their phone number or email.
    })
    .catch((error) => {
      // Some error occurred.
    });
  // [END auth_email_link_link]
}

function emailLinkReauth(email) {
  // [START auth_email_link_reauth]
  // Construct the email link credential from the current URL.
  var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
    email, window.location.href);

  // Re-authenticate the user with this credential.
  firebase.auth().currentUser.reauthenticateWithCredential(credential)
    .then((usercred) => {
      // The user is now successfully re-authenticated and can execute sensitive
      // operations.
    })
    .catch((error) => {
      // Some error occurred.
    });
  // [END auth_email_link_reauth]
}

function emailLinkDifferentiate() {
  // [START email_link_diferentiate]
  // After asking the user for their email.
  var email = window.prompt('Please provide your email');
  firebase.auth().fetchSignInMethodsForEmail(email)
    .then((signInMethods) => {
      // This returns the same array as fetchProvidersForEmail but for email
      // provider identified by 'password' string, signInMethods would contain 2
      // different strings:
      // 'emailLink' if the user previously signed in with an email/link
      // 'password' if the user has a password.
      // A user could have both.
      if (signInMethods.indexOf(
              firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
        // User can sign in with email/password.
      }
      if (signInMethods.indexOf(
              firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
        // User can sign in with email/link.
      }
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
    });
  // [END email_link_diferentiate]
}
