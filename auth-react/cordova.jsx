// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/cordova.md

function createGoogleProvider() {
  // [START auth_create_google_provider]
  const { GoogleAuthProvider } = require("firebase/auth/cordova");

  const provider = new GoogleAuthProvider();
  // [END auth_create_google_provider]
}

function cordovaSignInRedirect() {
  // [START auth_cordova_sign_in_redirect]
  const { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } = require("firebase/auth/cordova");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      try {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        const result = await getRedirectResult(auth);
        const credential = GoogleAuthProvider.credentialFromResult(result);

        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // ...
      } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      }
    }

    return <button onClick={signIn}>Sign in with Google</button>;
  }
  // [END auth_cordova_sign_in_redirect]
}

function cordovaRedirectResult() {
  // [START auth_cordova_redirect_result]
  const { useEffect, useState } = require("react");
  const { getAuth, getRedirectResult, GoogleAuthProvider } = require("firebase/auth/cordova");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            setUser(user);
          }
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_cordova_redirect_result]
}
