// This snippet file was generated by processing the source file:
// ./auth-next/index.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_make_google_credential_modular]
import { GoogleAuthProvider } from "firebase/auth";

const credential = GoogleAuthProvider.credential(
  googleUser.getAuthResponse().id_token);
// [END auth_make_google_credential_modular]