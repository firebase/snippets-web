// This snippet file was generated by processing the source file:
// ./auth-next/multi-tenancy.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START multitenant_account_exists_redirect_modular]
import { signInWithRedirect, getRedirectResult, fetchSignInMethodsForEmail, linkWithCredential } from "firebase/auth";
// Step 1.
// User tries to sign in to SAML provider.
auth.tenantId = 'TENANT_ID';
signInWithRedirect(auth, samlProvider);
var pendingCred;
try {
  // Redirect back from SAML IDP. auth.tenantId is null after redirecting.
  await getRedirectResult(auth);
} catch (error) {
  if (error.code === 'auth/account-exists-with-different-credential') {
    // Step 2.
    // User's email already exists.
    const tenantId = error.tenantId;
    // The pending SAML credential.
    pendingCred = error.credential;
    // The provider account's email address.
    const email = error.customData.email;
    // Need to set the tenant ID again as the page was reloaded and the
    // previous setting was reset.
    auth.tenantId = tenantId;
    // Get sign-in methods for this email.
    fetchSignInMethodsForEmail(auth, email)
      .then((methods) => {
        // Step 3.
        // Ask the user to sign in with existing Google account.
        if (methods[0] == 'google.com') {
          signInWithRedirect(auth, googleProvider);
        }
      });
  }
}

// Redirect back from Google. auth.tenantId is null after redirecting.
const result = await getRedirectResult(auth);
// Step 4
// Link the SAML AuthCredential to the existing user.
// result.user.tenantId is 'TENANT_ID'.
const linkResult = await linkWithCredential(result.user, pendingCred);
// SAML account successfully linked to the existing
// user.
goToApp();
// [END multitenant_account_exists_redirect_modular]