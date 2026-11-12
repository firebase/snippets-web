// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/apple.md

function appleProvider() {
  // [START auth_apple_provider_create]
  const { OAuthProvider } = require("firebase/auth");

  const provider = new OAuthProvider('apple.com');
  // [END auth_apple_provider_create]

  // [START auth_apple_provider_scopes]
  provider.addScope('email');
  provider.addScope('name');
  // [END auth_apple_provider_scopes]

  // [START auth_apple_provider_params]
  provider.setCustomParameters({
    // Localize the Apple authentication screen in French.
    locale: 'fr'
  });
  // [END auth_apple_provider_params]
}

function appleSignInPopup(provider) {
  // [START auth_apple_signin_popup]
  const { getAuth, signInWithPopup, OAuthProvider } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        // The signed-in user info.
        const user = result.user;

        // Apple credential
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The credential that was used.
        const credential = OAuthProvider.credentialFromError(error);

        // ...
      }
    }

    return <button onClick={signIn}>Sign in with Apple</button>;
  }
  // [END auth_apple_signin_popup]
}

function appleSignInRedirect(provider) {
  // [START auth_apple_signin_redirect]
  const { getAuth, signInWithRedirect } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      const auth = getAuth();
      await signInWithRedirect(auth, provider);
    }

    return <button onClick={signIn}>Sign in with Apple</button>;
  }
  // [END auth_apple_signin_redirect]
}

function appleSignInRedirectResult() {
  // [START auth_apple_signin_redirect_result]
  const { useEffect, useState } = require("react");
  const { getAuth, getRedirectResult, OAuthProvider } = require("firebase/auth");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      // Result from Redirect auth flow.
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          const credential = OAuthProvider.credentialFromResult(result);
          if (credential) {
            // You can also get the Apple OAuth Access and ID Tokens.
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
          }
          // The signed-in user info.
          const user = result.user;
          setUser(user);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The credential that was used.
          const credential = OAuthProvider.credentialFromError(error);

          // ...
        });
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_apple_signin_redirect_result]
}

function appleReauthenticatePopup() {
  // [START auth_apple_reauthenticate_popup]
  const { getAuth, reauthenticateWithPopup, OAuthProvider } = require("firebase/auth");

  function ReauthenticateButton() {
    async function reauthenticate() {
      // Result from Redirect auth flow.
      const auth = getAuth();
      const provider = new OAuthProvider('apple.com');

      try {
        const result = await reauthenticateWithPopup(auth.currentUser, provider);
        // User is re-authenticated with fresh tokens minted and can perform
        // sensitive operations like account deletion, or updating their email
        // address or password.

        // The signed-in user info.
        const user = result.user;

        // You can also get the Apple OAuth Access and ID Tokens.
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;

        // ...
      } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The credential that was used.
        const credential = OAuthProvider.credentialFromError(error);

        // ...
      }
    }

    return <button onClick={reauthenticate}>Reauthenticate with Apple</button>;
  }
  // [END auth_apple_reauthenticate_popup]
}

function appleLinkFacebook() {
  // [START auth_apple_link_facebook]
  const { getAuth, linkWithPopup, FacebookAuthProvider } = require("firebase/auth");

  function LinkButton() {
    async function link() {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      provider.addScope('user_birthday');

      // Assuming the current user is an Apple user linking a Facebook provider.
      try {
        await linkWithPopup(auth.currentUser, provider);
        // Facebook credential is linked to the current Apple user.
        // ...

        // The user can now sign in to the same account
        // with either Apple or Facebook.
      } catch (error) {
        // Handle error.
      }
    }

    return <button onClick={link}>Link Facebook</button>;
  }
  // [END auth_apple_link_facebook]
}

function appleNonceNode() {
  // [START auth_apple_nonce_node]
  const crypto = require("crypto");
  const string_decoder = require("string_decoder");

  // Generate a new random string for each sign-in
  const generateNonce = (length) => {
    const decoder = new string_decoder.StringDecoder("ascii");
    const buf = Buffer.alloc(length);
    let nonce = "";
    while (nonce.length < length) {
      crypto.randomFillSync(buf);
      nonce = decoder.write(buf);
    }
    return nonce.slice(0, length);
  };

  const unhashedNonce = generateNonce(10);

  // SHA256-hashed nonce in hex
  const hashedNonceHex = crypto.createHash('sha256')
    .update(unhashedNonce).digest().toString('hex');
  // [END auth_apple_nonce_node]
}

function appleSignInNonce(appleIdToken, unhashedNonce) {
  // [START auth_apple_signin_nonce]
  const { getAuth, signInWithCredential, OAuthProvider } = require("firebase/auth");

  const auth = getAuth();

  // Build Firebase credential with the Apple ID token.
  const provider = new OAuthProvider('apple.com');
  const authCredential = provider.credential({
    idToken: appleIdToken,
    rawNonce: unhashedNonce,
  });

  // Sign in with credential form the Apple user.
  signInWithCredential(auth, authCredential)
    .then((result) => {
      // User signed in.
    })
    .catch((error) => {
      // An error occurred. If error.code == 'auth/missing-or-invalid-nonce',
      // make sure you're sending the SHA256-hashed nonce as a hex string
      // with your request to Apple.
      console.log(error);
    });
  // [END auth_apple_signin_nonce]
}
