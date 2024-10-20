// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

async function signInWithEmailPassword() {
  const email = "test@example.com";
  const password = "hunter2";

  // [START auth_signin_password]
  const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in
    const user = userCredential.user;
    // ...
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
  // [END auth_signin_password]
}

async function signUpWithEmailPassword() {
  const email = "test@example.com";
  const password = "hunter2";

  // [START auth_signup_password]
  const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Signed up
    const user = userCredential.user;
    // ...
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  }
  // [END auth_signup_password]
}

async function sendEmailVerification() {
  // [START auth_send_email_verification]
  const { getAuth, sendEmailVerification } = require("firebase/auth");

  const auth = getAuth();
  await sendEmailVerification(auth.currentUser);
  // Email verification sent!
  // ...
  // [END auth_send_email_verification]
}

async function sendPasswordReset() {
  const email = "sam@example.com";

  // [START auth_send_password_reset]
  const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    // Password reset email sent!
    // ..
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  }
  // [END auth_send_password_reset]
}
