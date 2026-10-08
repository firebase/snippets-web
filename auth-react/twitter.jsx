// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function twitterProvider() {
  // [START auth_twitter_provider_create]
  const { TwitterAuthProvider } = require("firebase/auth");

  const provider = new TwitterAuthProvider();
  // [END auth_twitter_provider_create]

  // [START auth_twitter_provider_params]
  provider.setCustomParameters({
    'lang': 'es'
  });
  // [END auth_twitter_provider_params]
}

function twitterSignInPopup(provider) {
  // [START auth_twitter_signin_popup]
  const { useTransition } = require("react");
  const { getAuth, signInWithPopup, TwitterAuthProvider } = require("firebase/auth");

  function SignInButton() {
    const [isPending, startTransition] = useTransition();

    function signIn() {
      startTransition(async () => {
        const auth = getAuth();
        try {
          const result = await signInWithPopup(auth, provider);
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const secret = credential.secret;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        } catch (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
        }
      });
    }

    return <button onClick={signIn} disabled={isPending}>Sign in with Twitter</button>;
  }
  // [END auth_twitter_signin_popup]
}

function twitterSignInRedirectResult() {
  // [START auth_twitter_signin_redirect_result]
  const { useEffect, useState } = require("react");
  const { getAuth, getRedirectResult, TwitterAuthProvider } = require("firebase/auth");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const secret = credential.secret;
          // ...

          // The signed-in user info.
          const user = result.user;
          setUser(user);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
        });
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_twitter_signin_redirect_result]
}

function twitterProviderCredential(accessToken, secret) {
  // [START auth_twitter_provider_credential]
  const { TwitterAuthProvider } = require("firebase/auth");

  const credential = TwitterAuthProvider.credential(accessToken, secret);
  // [END auth_twitter_provider_credential]
}
