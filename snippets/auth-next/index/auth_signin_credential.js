// This snippet file was generated by processing the source file:
// ./auth-next/index.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_signin_credential_modular]
import { getAuth, signInWithCredential } from "firebase/auth";

// Sign in with the credential from the user.
const auth = getAuth();
signInWithCredential(auth, credential)
  .then((result) => {
    // Signed in 
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // ...
  });
// [END auth_signin_credential_modular]