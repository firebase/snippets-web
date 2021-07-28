// This snippet file was generated by processing the source file:
// ./auth-next/yahoo-oauth.js
//
// To update the snippets in this file, edit the source file and then
// run 'npm run snippets'.

// [START auth_yahoo_reauth_popup_modular]
import { getAuth, reauthenticateWithPopup, OAuthProvider } from "firebase/auth";

const provider = new OAuthProvider('yahoo.com');
const auth = getAuth();
reauthenticateWithPopup(auth.currentUser, provider)
    .then((result) => {
      // User is re-authenticated with fresh tokens minted and
      // should be able to perform sensitive operations like account
      // deletion and email or password update.
      // IdP data available in result.additionalUserInfo.profile.

      // Get the OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
// [END auth_yahoo_reauth_popup_modular]