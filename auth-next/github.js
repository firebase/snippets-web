// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function githubProvider() {
  // [START auth_github_provider_create]
  const { GithubAuthProvider } = require("firebase/auth");

  const provider = new GithubAuthProvider();
  // [END auth_github_provider_create]

  // [START auth_github_provider_scopes]
  provider.addScope('repo');
  // [END auth_github_provider_scopes]

  // [START auth_github_provider_params]
  provider.setCustomParameters({
    'allow_signup': 'false'
  });
  // [END auth_github_provider_params]
}

function githubSignInPopup(provider) {
  // [START auth_github_signin_popup]
  const { getAuth, signInWithPopup, GithubAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_github_signin_popup]
}

function githubSignInRedirectResult() {
  // [START auth_github_signin_redirect_result]
  const { getAuth, getRedirectResult, GithubAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getRedirectResult(auth)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const token = credential.accessToken;
        // ...
      }

      // The signed-in user info.
      const user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });
  // [END auth_github_signin_redirect_result]
}

