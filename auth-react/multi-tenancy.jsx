// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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
  // Initialize Firebase once at module scope (e.g. src/firebase.js), not inside a component.
  const firebaseApp1 = initializeApp(firebaseConfig1, 'app1_for_tenantId1');
  const firebaseApp2 = initializeApp(firebaseConfig2, 'app2_for_tenantId2');

  const auth1 = getAuth(firebaseApp1);
  const auth2 = getAuth(firebaseApp2);

  auth1.tenantId = "TENANT_ID1";
  auth2.tenantId = "TENANT_ID2";
  // [END multitenant_switch_tenant_multiinstance]
}

function passwordSignInWithTenantDemo(auth) {
  // [START multitenant_signin_password_demo]
  const { useEffect, useState } = require("react");
  const { signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");

  function SignInForm() {
    const [user, setUser] = useState(null);

    async function signIn(formData) {
      // Switch to TENANT_ID1
      auth.tenantId = 'TENANT_ID1';

      // Sign in with tenant
      const userCredential = await signInWithEmailAndPassword(auth, formData.get("email"), formData.get("password"));
      // User is signed in.
      const user = userCredential.user;
      // user.tenantId is set to 'TENANT_ID1'.
      // Switch to 'TENANT_ID2'.
      auth.tenantId = 'TENANT_ID2';
      // auth.currentUser still points to the user.
      // auth.currentUser.tenantId is 'TENANT_ID1'.
    }

    // You could also get the current user from Auth state observer.
    useEffect(() => {
      // onAuthStateChanged returns an unsubscribe function. Returning it from the
      // effect detaches the listener when the component unmounts.
      return onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
    }, []);

    return user ? (
      // User is signed in.
      // user.tenantId is set to 'TENANT_ID1'.
      <p>{user.tenantId}</p>
    ) : (
      // No user is signed in.
      <form action={signIn}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">Sign in</button>
      </form>
    );
  }
  // [END multitenant_signin_password_demo]
}

function signUpWithTenant(auth) {
  // [START multitenant_signup_password]
  const { useActionState } = require("react");
  const { createUserWithEmailAndPassword } = require("firebase/auth");

  function SignUpForm() {
    const [error, signUp, isPending] = useActionState(async (previousError, formData) => {
      auth.tenantId = 'TENANT_ID';

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"));
        // User is signed in.
        // userCredential.user.tenantId is 'TENANT_ID'.
        return null;
      } catch (error) {
        // Handle / display error.
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={signUp}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit" disabled={isPending}>Sign up</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END multitenant_signup_password]
}


function passwordSignInWithTenant(auth) {
  // [START multitenant_signin_password]
  const { useActionState } = require("react");
  const { signInWithEmailAndPassword } = require("firebase/auth");

  function SignInForm() {
    const [error, signIn, isPending] = useActionState(async (previousError, formData) => {
      auth.tenantId = 'TENANT_ID';

      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.get("email"), formData.get("password"));
        // User is signed in.
        // userCredential.user.tenantId is 'TENANT_ID'.
        return null;
      } catch (error) {
        // Handle / display error.
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={signIn}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit" disabled={isPending}>Sign in</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END multitenant_signin_password]
}

function samlSignInPopupTenant(auth, provider) {
  // [START multitenant_signin_saml_popup]
  const { useTransition } = require("react");
  const { signInWithPopup } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        // Switch to TENANT_ID1.
        auth.tenantId = 'TENANT_ID1';

        // Sign-in with popup.
        try {
          const userCredential = await signInWithPopup(auth, provider);
          // User is signed in.
          const user = userCredential.user;
          // user.tenantId is set to 'TENANT_ID1'.
          // Provider data available from the result.user.getIdToken()
          // or from result.user.providerData
        } catch (error) {
          // Handle / display error.
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in with SAML</button>;
  }
  // [END multitenant_signin_saml_popup]
}

function samlSignInRedirectTenant(auth, provider) {
  // [START multitenant_signin_saml_redirect]
  const { useEffect, useTransition } = require("react");
  const { signInWithRedirect, getRedirectResult } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        // Switch to TENANT_ID1.
        auth.tenantId = 'TENANT_ID1';

        // Sign-in with redirect.
        await signInWithRedirect(auth, provider);
      });
    }

    // After the user completes sign-in and returns to the app, you can get
    // the sign-in result by calling getRedirectResult. However, if they sign out
    // and sign in again with an IdP, no tenant is used.
    useEffect(() => {
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
    }, []);

    return <button onClick={signIn} disabled={isPending}>Sign in with SAML</button>;
  }
  // [END multitenant_signin_saml_redirect]
}

function sendSignInLinkToEmailTenant(auth, actionCodeSettings) {
  // [START multitenant_send_emaillink]
  const { useActionState } = require("react");
  const { sendSignInLinkToEmail } = require("firebase/auth");

  function SendSignInLinkForm() {
    const [error, sendLink, isPending] = useActionState(async (previousError, formData) => {
      const email = formData.get("email");
      // Switch to TENANT_ID1
      auth.tenantId = 'TENANT_ID1';

      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        return null;
      } catch (error) {
        // Handle / display error.
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={sendLink}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>Send sign-in link</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END multitenant_send_emaillink]
}

function signInWithEmailLinkTenant(auth) {
  // [START multitenant_signin_emaillink]
  const { useEffect, useState } = require("react");
  const { isSignInWithEmailLink, parseActionCodeURL, signInWithEmailLink } = require("firebase/auth");

  function EmailLinkSignIn() {
    const [user, setUser] = useState(null);

    useEffect(() => {
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
            setUser(result.user);
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
          });
      }
    }, []);

    return user ? <p>{user.displayName}</p> : null;
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

function signInWithCustomTokenTenant(auth) {
  // [START multitenant_signin_custom_token]
  const { useTransition } = require("react");
  const { signInWithCustomToken } = require("firebase/auth");

  function SignInButton({ token }) {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        auth.tenantId = 'TENANT_ID1';

        try {
          await signInWithCustomToken(auth, token);
        } catch (error) {
          // Handle / display error.
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in</button>;
  }
  // [END multitenant_signin_custom_token]
}

function linkAccountTenant(auth, provider) {
  // [START multitenant_account_linking]
  const { useActionState } = require("react");
  const { signInWithPopup, EmailAuthProvider, linkWithCredential, SAMLAuthProvider, signInWithCredential } = require("firebase/auth");

  function LinkAccountForm() {
    const [error, linkAccount, isPending] = useActionState(async (previousError, formData) => {
      // Switch to TENANT_ID1
      auth.tenantId = 'TENANT_ID1';

      try {
        // Sign-in with popup
        const userCredential = await signInWithPopup(auth, provider);
        // Existing user with e.g. SAML provider.
        const prevUser = userCredential.user;
        const emailCredential =
          EmailAuthProvider.credential(formData.get("email"), formData.get("password"));
        const linkResult = await linkWithCredential(prevUser, emailCredential);
        // Sign in with the newly linked credential
        const linkCredential = SAMLAuthProvider.credentialFromResult(linkResult);
        const signInResult = await signInWithCredential(auth, linkCredential);
        // Handle sign in of merged user
        // ...
        return null;
      } catch (error) {
        // Handle / display error.
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={linkAccount}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit" disabled={isPending}>Link account</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END multitenant_account_linking]
}

function accountExistsPopupTenant(auth, samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_popup]
  const { useTransition } = require("react");
  const { signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        // Step 1.
        // User tries to sign in to the SAML provider in that tenant.
        auth.tenantId = 'TENANT_ID';
        try {
          await signInWithPopup(auth, samlProvider);
        } catch (error) {
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
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in with SAML</button>;
  }
  // [END multitenant_account_exists_popup]
}

function accountExistsRedirectTenant(auth, samlProvider, googleProvider, goToApp) {
  // [START multitenant_account_exists_redirect]
  const { useEffect, useTransition } = require("react");
  const { signInWithRedirect, getRedirectResult, fetchSignInMethodsForEmail, linkWithCredential } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        // Step 1.
        // User tries to sign in to SAML provider.
        auth.tenantId = 'TENANT_ID';
        await signInWithRedirect(auth, samlProvider);
      });
    }

    useEffect(() => {
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
    }, []);

    return <button onClick={signIn} disabled={isPending}>Sign in with SAML</button>;
  }
  // [END multitenant_account_exists_redirect]
}
