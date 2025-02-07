// This snippet file was generated by processing the source file:
// ./auth-next/email.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START auth_signup_password_modular]
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
// [END auth_signup_password_modular]