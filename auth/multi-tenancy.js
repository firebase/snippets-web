// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

function setTenant() {
  // [START multitenant_set_tenant]
  const tenantId = "TENANT_ID1";
  firebase.auth().tenantId = tenantId;
  // [END multitenant_set_tenant]
}

function switchTenantSingleAuth() {
  // [START multitenant_switch_tenant]
  // One Auth instance
  // Switch to tenant1
  firebase.auth().tenantId = "TENANT_ID1";
  // Switch to tenant2
  firebase.auth().tenantId = "TENANT_ID2";
  // Switch back to project level IdPs
  firebase.auth().tenantId = null;
  // [END multitenant_switch_tenant]
}

function switchTenantMultiAuth(config) {
  // [START multitenant_switch_tenant_multiinstance]
  // Multiple Auth instances
  firebase.initializeApp(config, 'app1_for_tenantId1');
  firebase.initializeApp(config, 'app2_for_tenantId2');

  const auth1 = firebase.app('app1').auth();
  const auth2 = firebase.app('app2').auth();

  auth1.tenantId = "TENANT_ID1";
  auth2.tenantId = "TENANT_ID2";
  // [END multitenant_switch_tenant_multiinstance]
}

function passwordSignInWithTenantDemo(email, password) {
  // [START multitenant_signin_password_demo]
  // Switch to TENANT_ID1
  firebase.auth().tenantId = 'TENANT_ID1';

  // Sign in with tenant
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      const user = result.user;
      // user.tenantId is set to 'TENANT_ID1'.
      // Switch to 'TENANT_ID2'.
      firebase.auth().tenantId = 'TENANT_ID2';
      // firebase.auth().currentUser still point to the user.
      // firebase.auth().currentUser.tenantId is 'TENANT_ID1'.
    });

  // You could also get the current user from Auth state observer.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      // user.tenantId is set to 'TENANT_ID1'.
    } else {
      // No user is signed in.
    }
  });
  // [END multitenant_signin_password_demo]
}

function signUpWithTenant(email, password) {
  // [START multitenant_signup_password]
  firebase.auth().tenantId = 'TENANT_ID';

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      // result.user.tenantId is 'TENANT_ID'.
    }).catch((error) => {
      // Handle error.
    });
  // [END multitenant_signup_password]
}


function passwordSignInWithTenant(email, password) {
  // [START multitenant_signin_password]
  firebase.auth().tenantId = 'TENANT_ID';

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      // result.user.tenantId is 'TENANT_ID'.
    }).catch((error) => {
      // Handle error.
    });
  // [END multitenant_signin_password]
}

function samlSignInPopupTenant(provider) {
  // [START multitenant_signin_saml_popup]
  // Switch to TENANT_ID1.
  firebase.auth().tenantId = 'TENANT_ID1';

  // Sign-in with popup.
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // User is signed in.
      // tenant ID is available in result.user.tenantId.
      // Identity provider data is available in result.additionalUserInfo.profile.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END multitenant_signin_saml_popup]
}

function samlSignInRedirectTenant(provider) {
  // [START multitenant_signin_saml_redirect]
  // Switch to TENANT_ID1.
  firebase.auth().tenantId = 'TENANT_ID1';

  // Sign-in with redirect.
  firebase.auth().signInWithRedirect(provider);

  // After the user completes sign-in and returns to the app, you can get
  // the sign-in result by calling getRedirectResult. However, if they sign out
  // and sign in again with an IdP, no tenant is used.
  firebase.auth().getRedirectResult()
    .then((result) => {
      // User is signed in.
      // The tenant ID available in result.user.tenantId.
      // Identity provider data is available in result.additionalUserInfo.profile.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END multitenant_signin_saml_redirect]
}

function sendSignInLinkToEmailTenant(email, actionCodeSettings) {
  // [START multitenant_send_emaillink]
  // Switch to TENANT_ID1
  firebase.auth().tenantId = 'TENANT_ID1';

  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
    });
  // [END multitenant_send_emaillink]
}

function signInWithEmailLinkTenant() {
  // [START multitenant_signin_emaillink]
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    const actionCodeUrl = firebase.auth.ActionCodeURL.parseLink(window.location.href);
    if (actionCodeUrl.tenantId) {
      firebase.auth().tenantId = actionCodeUrl.tenantId;
    }
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result) => {
        // User is signed in.
        // tenant ID available in result.user.tenantId.
      });
  }
  // [END multitenant_signin_emaillink]
}

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

function signInWithCustomTokenTenant(token) {
  // [START multitenant_signin_custom_token]
  firebase.auth().tenantId = 'TENANT_ID1';

  firebase.auth().signInWithCustomToken(token)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  // [END multitenant_signin_custom_token]
}

function linkAccountTenant(provider, email, password) {
  // [START multitenant_account_linking]
  // Switch to TENANT_ID1
  firebase.auth().tenantId = 'TENANT_ID1';

  // Sign-in with popup
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Existing user with e.g. SAML provider.
      const user = result.user;
      const emailCredential =
        firebase.auth.EmailAuthProvider.credential(email, password);
      return user.linkWithCredential(emailCredential);
    })
    .then((linkResult) => {
      // The user can sign in with both SAML and email/password now.
    });
  // [END multitenant_account_linking]
}

function accountExistsPopupTenant(samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_popup]
  // Step 1.
  // User tries to sign in to the SAML provider in that tenant.
  firebase.auth().tenantId = 'TENANT_ID';
  firebase.auth().signInWithPopup(samlProvider)
    .catch((error) => {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending SAML credential.
        const pendingCred = error.credential;
        // The credential's tenantId if needed: error.tenantId
        // The provider account's email address.
        const email = error.email;
        // Get sign-in methods for this email.
        firebase.auth().fetchSignInMethodsForEmail(email)
          .then((methods) => {
            // Step 3.
            // Ask the user to sign in with existing Google account.
            if (methods[0] == 'google.com') {
              firebase.auth().signInWithPopup(googleProvider)
                .then((result) => {
                  // Step 4
                  // Link the SAML AuthCredential to the existing user.
                  result.user.linkWithCredential(pendingCred)
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

function accountExistsRedirectTenant(samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_redirect]
  // Step 1.
  // User tries to sign in to SAML provider.
  firebase.auth().tenantId = 'TENANT_ID';
  firebase.auth().signInWithRedirect(samlProvider);
  var pendingCred;
  // Redirect back from SAML IDP. auth.tenantId is null after redirecting.
  firebase.auth().getRedirectResult().catch((error) => {
    if (error.code === 'auth/account-exists-with-different-credential') {
      // Step 2.
      // User's email already exists.
      const tenantId = error.tenantId;
      // The pending SAML credential.
      pendingCred = error.credential;
      // The provider account's email address.
      const email = error.email;
      // Need to set the tenant ID again as the page was reloaded and the
      // previous setting was reset.
      firebase.auth().tenantId = tenantId;
      // Get sign-in methods for this email.
      firebase.auth().fetchSignInMethodsForEmail(email)
        .then((methods) => {
          // Step 3.
          // Ask the user to sign in with existing Google account.
          if (methods[0] == 'google.com') {
            firebase.auth().signInWithRedirect(googleProvider);
          }
        });
    }
  });

  // Redirect back from Google. auth.tenantId is null after redirecting.
  firebase.auth().getRedirectResult().then((result) => {
    // Step 4
    // Link the SAML AuthCredential to the existing user.
    // result.user.tenantId is 'TENANT_ID'.
    result.user.linkWithCredential(pendingCred)
      .then((linkResult) => {
        // SAML account successfully linked to the existing
        // user.
        goToApp();
      });
  });
  // [END multitenant_account_exists_redirect]
}