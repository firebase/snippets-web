// This snippet file was generated by processing the source file:
// ./auth-next/multi-tenancy.js
//
// To update the snippets in this file, edit the source and then run
// 'npm run snippets'.

// [START multitenant_signin_password_demo_modular]
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// Switch to TENANT_ID1
auth.tenantId = 'TENANT_ID1';

// Sign in with tenant
const userCredential = await signInWithEmailAndPassword(auth, email, password);
// User is signed in.
const user = userCredential.user;
// user.tenantId is set to 'TENANT_ID1'.
// Switch to 'TENANT_ID2'.
auth.tenantId = 'TENANT_ID2';
// auth.currentUser still points to the user.
// auth.currentUser.tenantId is 'TENANT_ID1'.

// You could also get the current user from Auth state observer.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    // user.tenantId is set to 'TENANT_ID1'.
  } else {
    // No user is signed in.
  }
});
// [END multitenant_signin_password_demo_modular]