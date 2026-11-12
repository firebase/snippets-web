// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function samlProvider() {
  // [START auth_saml_provider_create]
  const { SAMLAuthProvider } = require("firebase/auth");

  const provider = new SAMLAuthProvider("saml.myProvider");
  // [END auth_saml_provider_create]
}

function samlSignInPopup(provider) {
  // [START auth_saml_signin_popup]
  const { getAuth, signInWithPopup, SAMLAuthProvider } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        // User is signed in.
        // Provider data available from the result.user.getIdToken()
        // or from result.user.providerData
      } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = SAMLAuthProvider.credentialFromError(error);
        // Handle / display error.
        // ...
      }
    }

    return <button onClick={signIn}>Sign in with SAML</button>;
  }
  // [END auth_saml_signin_popup]
}

function samlSignInRedirect(provider) {
  // [START auth_saml_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      await signInWithRedirect(auth, provider);
    }

    return <button onClick={signIn}>Sign in with SAML</button>;
  }
  // [END auth_saml_signin_redirect]
}

function samlSignInRedirectResult(provider) {
  // [START auth_saml_signin_redirect_result]
  const { useEffect, useState } = require("react");
  const { getAuth, getRedirectResult, SAMLAuthProvider } = require("firebase/auth");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          // User is signed in.
          setUser(result.user);
          // Provider data available from the result.user.getIdToken()
          // or from result.user.providerData
        })
        .catch((error) => {
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
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_saml_signin_redirect_result]
}
