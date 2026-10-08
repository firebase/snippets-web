// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function oidcProvider() {
  // [START auth_oidc_provider_create]
  const { OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider("oidc.myProvider");
  // [END auth_oidc_provider_create]
}

function oidcSignInPopup(provider) {
  // [START auth_oidc_signin_popup]
  const { useTransition } = require("react");
  const { getAuth, signInWithPopup, OAuthProvider } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        const auth = getAuth();
        try {
          const result = await signInWithPopup(auth, provider);
          // User is signed in.
          const credential = OAuthProvider.credentialFromResult(result);
          // This gives you an access token for the OIDC provider. You can use it to directly interact with that provider
        } catch (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = OAuthProvider.credentialFromError(error);
          // Handle / display error.
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in with OIDC</button>;
  }
  // [END auth_oidc_signin_popup]
}

function oidcSignInRedirect(provider) {
  // [START auth_oidc_signin_redirect]
  const { useTransition } = require("react");
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        const auth = getAuth();
        await signInWithRedirect(auth, provider);
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in with OIDC</button>;
  }
  // [END auth_oidc_signin_redirect]
}

function oidcSignInRedirectResult(provider) {
  // [START auth_oidc_signin_redirect_result]
  const { useEffect, useState } = require("react");
  const { getAuth, getRedirectResult, OAuthProvider } = require("firebase/auth");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          // User is signed in.
          setUser(result.user);
          const credential = OAuthProvider.credentialFromResult(result);
          // This gives you an access token for the OIDC provider. You can use it to directly interact with that provider
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = OAuthProvider.credentialFromError(error);
          // Handle / display error.
          // ...
        });
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_oidc_signin_redirect_result]
}

function oidcDirectSignIn(provider, oidcIdToken) {
  // [START auth_oidc_direct_sign_in]
  const { getAuth, OAuthProvider, signInWithCredential } = require("firebase/auth");

  const auth = getAuth();
  const credential = provider.credential({
    idToken: oidcIdToken,
  });
  signInWithCredential(auth, credential)
    .then((result) => {
      // User is signed in.
      const newCredential = OAuthProvider.credentialFromResult(result);
      // This gives you a new access token for the OIDC provider. You can use it to directly interact with that provider.
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);
      // Handle / display error.
      // ...
    });
  // [END auth_oidc_direct_sign_in]
}
