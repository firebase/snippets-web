// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function signInWithEmailPassword() {
  const email = "test@example.com";
  const password = "hunter2";

  // [START auth_signin_password]
  const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      // Signed in 
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  // [END auth_signin_password]
}

function signUpWithEmailPasswoerd() {
  const email = "test@example.com";
  const password = "hunter2";

  // [START auth_signup_password]
  const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      // Signed in 
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  // [END auth_signup_password]
}

function sendEmailVerification() {
  // [START auth_send_email_verification]
  const { getAuth, sendEmailVerification } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  sendEmailVerification(auth.currentUser)
    .then(() => {
      // Email verification sent!
      // ...
    });
  // [END auth_send_email_verification]
}

function sendPasswordReset() {
  const email = "sam@example.com";

  // [START auth_send_password_reset]
  const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  // [END auth_send_password_reset]
}
