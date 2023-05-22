// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function setTenant() {
  // [START multitenant_set_tenant]
  const { getAuth } = require("firebase/auth");
  const auth = getAuth();
  const tenantId = "TENANT_ID1";
  auth.tenantId = tenantId;
  // [END multitenant_set_tenant]
}

function switchTenantSingleAuth(auth) {
  // [START multitenant_switch_tenant]
  // One Auth instance
  // Switch to tenant1
  auth.tenantId = "TENANT_ID1";
  // Switch to tenant2
  auth.tenantId = "TENANT_ID2";
  // Switch back to project level IdPs
  auth.tenantId = null;
  // [END multitenant_switch_tenant]
}

function switchTenantMultiAuth(firebaseConfig1, firebaseConfig2) {
  // [START multitenant_switch_tenant_multiinstance]
  // Multiple Auth instances
  const { initializeApp } = require("firebase/app");
  const { getAuth } = require("firebase/auth");
  const firebaseApp1 = initializeApp(firebaseConfig1, 'app1_for_tenantId1');
  const firebaseApp2 = initializeApp(firebaseConfig2, 'app2_for_tenantId2');

  const auth1 = getAuth(firebaseApp1);
  const auth2 = getAuth(firebaseApp2);

  auth1.tenantId = "TENANT_ID1";
  auth2.tenantId = "TENANT_ID2";
  // [END multitenant_switch_tenant_multiinstance]
}

function passwordSignInWithTenantDemo(auth, email, password) {
  // [START multitenant_signin_password_demo]
  const { signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
  // Switch to TENANT_ID1
  auth.tenantId = 'TENANT_ID1';

  // Sign in with tenant
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User is signed in.
      const user = userCredential.user;
      // user.tenantId is set to 'TENANT_ID1'.
      // Switch to 'TENANT_ID2'.
      auth.tenantId = 'TENANT_ID2';
      // auth.currentUser still points to the user.
      // auth.currentUser.tenantId is 'TENANT_ID1'.
    });

  // You could also get the current user from Auth state observer.
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      // user.tenantId is set to 'TENANT_ID1'.
    } else {
      // No user is signed in.
    }
  });
  // [END multitenant_signin_password_demo]
}

function signUpWithTenant(auth, email, password) {
  // [START multitenant_signup_password]
  const { createUserWithEmailAndPassword } = require("firebase/auth");
  auth.tenantId = 'TENANT_ID';

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User is signed in.
      // userCredential.user.tenantId is 'TENANT_ID'.
    }).catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_signup_password]
}


function passwordSignInWithTenant(auth, email, password) {
  // [START multitenant_signin_password]
  const { signInWithEmailAndPassword } = require("firebase/auth");
  auth.tenantId = 'TENANT_ID';

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User is signed in.
      // userCredential.user.tenantId is 'TENANT_ID'.
    }).catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_signin_password]
}

function samlSignInPopupTenant(auth, provider) {
  // [START multitenant_signin_saml_popup]
  const { signInWithPopup } = require("firebase/auth");
  // Switch to TENANT_ID1.
  auth.tenantId = 'TENANT_ID1';

  // Sign-in with popup.
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      // User is signed in.
      const user = userCredential.user;
      // user.tenantId is set to 'TENANT_ID1'.
      // Provider data available from the result.user.getIdToken()
      // or from result.user.providerData
    })
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_signin_saml_popup]
}

function samlSignInRedirectTenant(auth, provider) {
  // [START multitenant_signin_saml_redirect]
  const { signInWithRedirect, getRedirectResult } = require("firebase/auth");
  // Switch to TENANT_ID1.
  auth.tenantId = 'TENANT_ID1';

  // Sign-in with redirect.
  signInWithRedirect(auth, provider);

  // After the user completes sign-in and returns to the app, you can get
  // the sign-in result by calling getRedirectResult. However, if they sign out
  // and sign in again with an IdP, no tenant is used.
  getRedirectResult(auth)
    .then((result) => {
      // User is signed in.
      // The tenant ID available in result.user.tenantId.
      // Provider data available from the result.user.getIdToken()
      // or from result.user.providerData
    })
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_signin_saml_redirect]
}

function sendSignInLinkToEmailTenant(auth, email, actionCodeSettings) {
  // [START multitenant_send_emaillink]
  const { sendSignInLinkToEmail } = require("firebase/auth");
  // Switch to TENANT_ID1
  auth.tenantId = 'TENANT_ID1';

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_send_emaillink]
}

function signInWithEmailLinkTenant(auth) {
  // [START multitenant_signin_emaillink]
  const { isSignInWithEmailLink, parseActionCodeURL, signInWithEmailLink } = require("firebase/auth");
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const actionCodeUrl = parseActionCodeURL(window.location.href);
    if (actionCodeUrl.tenantId) {
      auth.tenantId = actionCodeUrl.tenantId;
    }
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // User is signed in.
        // tenant ID available in result.user.tenantId.
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
      });
  }
  // [END multitenant_signin_emaillink]
}

// Same as the code in auth/ since this is the admin SDK.
function createCustomTokenTenant(admin, uid) {
  // [START multitenant_create_custom_token]
  // Ensure you're using a tenant-aware auth instance
  const tenantManager = admin.auth().tenantManager();
  const tenantAuth = tenantManager.authForTenant('TENANT_ID1');

  // Create a custom token in the usual manner
  tenantAuth.createCustomToken(uid)
    .then((customToken) => {
      // Send token back to client
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
    });
  // [END multitenant_create_custom_token]
}

function signInWithCustomTokenTenant(auth, token) {
  // [START multitenant_signin_custom_token]
  const { signInWithCustomToken } = require("firebase/auth");
  auth.tenantId = 'TENANT_ID1';

  signInWithCustomToken(auth, token)
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_signin_custom_token]
}

function linkAccountTenant(auth, provider, email, password) {
  // [START multitenant_account_linking]
  const { signInWithPopup, EmailAuthProvider, linkWithCredential, SAMLAuthProvider, signInWithCredential } = require("firebase/auth");
  // Switch to TENANT_ID1
  auth.tenantId = 'TENANT_ID1';

  // Sign-in with popup
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      // Existing user with e.g. SAML provider.
      const prevUser = userCredential.user;
      const emailCredential =
        EmailAuthProvider.credential(email, password);
      return linkWithCredential(prevUser, emailCredential)
        .then((linkResult) => {
          // Sign in with the newly linked credential
          const linkCredential = SAMLAuthProvider.credentialFromResult(linkResult);
          return signInWithCredential(auth, linkCredential);
        })
        .then((signInResult) => {
          // Handle sign in of merged user
          // ...
        });
    })
    .catch((error) => {
      // Handle / display error.
      // ...
    });
  // [END multitenant_account_linking]
}

function accountExistsPopupTenant(auth, samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_popup]
  const { signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential } = require("firebase/auth");
  // Step 1.
  // User tries to sign in to the SAML provider in that tenant.
  auth.tenantId = 'TENANT_ID';
  signInWithPopup(auth, samlProvider)
    .catch((error) => {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending SAML credential.
        const pendingCred = error.credential;
        // The credential's tenantId if needed: error.tenantId
        // The provider account's email address.
        const email = error.customData.email;
        // Get sign-in methods for this email.
        fetchSignInMethodsForEmail(email, auth)
          .then((methods) => {
            // Step 3.
            // Ask the user to sign in with existing Google account.
            if (methods[0] == 'google.com') {
              signInWithPopup(auth, googleProvider)
                .then((result) => {
                  // Step 4
                  // Link the SAML AuthCredential to the existing user.
                  linkWithCredential(result.user, pendingCred)
                    .then((linkResult) => {
                      // SAML account successfully linked to the existing
                      // user.
                      goToApp();
                    });
                });
            }
          });
      }
    });
  // [END multitenant_account_exists_popup]
}

function accountExistsRedirectTenant(auth, samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_redirect]
  const { signInWithRedirect, getRedirectResult, fetchSignInMethodsForEmail, linkWithCredential } = require("firebase/auth");
  // Step 1.
  // User tries to sign in to SAML provider.
  auth.tenantId = 'TENANT_ID';
  signInWithRedirect(auth, samlProvider);
  var pendingCred;
  // Redirect back from SAML IDP. auth.tenantId is null after redirecting.
  getRedirectResult(auth).catch((error) => {
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
  });

  // Redirect back from Google. auth.tenantId is null after redirecting.
  getRedirectResult(auth).then((result) => {
    // Step 4
    // Link the SAML AuthCredential to the existing user.
    // result.user.tenantId is 'TENANT_ID'.
    linkWithCredential(result.user, pendingCred)
      .then((linkResult) => {
        // SAML account successfully linked to the existing
        // user.
        goToApp();
      });
  });
  // [END multitenant_account_exists_redirect]
}