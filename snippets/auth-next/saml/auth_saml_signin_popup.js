// This snippet file was generated by processing the source file:
// ./auth-next/saml.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START auth_saml_signin_popup_modular]
import { getAuth, signInWithPopup, SAMLAuthProvider } from "firebase/auth";

const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // User is signed in.
    // Provider data available from the result.user.getIdToken()
    // or from result.user.providerData
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = SAMLAuthProvider.credentialFromError(error);
    // Handle / display error.
    // ...
  });
// [END auth_saml_signin_popup_modular]