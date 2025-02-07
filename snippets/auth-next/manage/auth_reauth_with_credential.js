// This snippet file was generated by processing the source file:
// ./auth-next/manage.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START auth_reauth_with_credential_modular]
import { getAuth, reauthenticateWithCredential } from "firebase/auth";

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
// [END auth_reauth_with_credential_modular]