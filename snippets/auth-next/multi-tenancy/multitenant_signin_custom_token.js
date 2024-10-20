// This snippet file was generated by processing the source file:
// ./auth-next/multi-tenancy.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START multitenant_signin_custom_token_modular]
import { signInWithCustomToken } from "firebase/auth";
auth.tenantId = 'TENANT_ID1';

try {
  await signInWithCustomToken(auth, token);
} catch (error) {
  // Handle / display error.
  // ...
}
// [END multitenant_signin_custom_token_modular]