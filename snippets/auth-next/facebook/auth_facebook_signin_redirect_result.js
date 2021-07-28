// This snippet file was generated by processing the source file:
// ./auth-next/facebook.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_facebook_signin_redirect_result_modular]
import { getAuth, getRedirectResult, FacebookAuthProvider } from "firebase/auth";

const auth = getAuth();
getRedirectResult(auth)
  .then((result) => {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    const user = result.user;
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    // ...
  });
// [END auth_facebook_signin_redirect_result_modular]