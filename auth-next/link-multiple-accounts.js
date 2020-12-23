// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

const MyUserDataRepo = function() {};

MyUserDataRepo.prototype.merge = function(data1, data2) {
  // TODO(you): How you implement this is specific to your application!
  return {
    ...data1,
    ...data2,
  };
};

MyUserDataRepo.prototype.set = function(user, data) {
  // TODO(you): How you implement this is specific to your application!
};

MyUserDataRepo.prototype.delete = function(user) {
  // TODO(you): How you implement this is specific to your application!
};

MyUserDataRepo.prototype.get = function(user) {
  // TODO(you): How you implement this is specific to your application!
  return {};
};

function getProviders() {
  // [START auth_get_providers]
  const { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } = require("firebase/auth");

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();
  const githubProvider = new GithubAuthProvider();
  // [END auth_get_providers]
}

function simpleLink(credential) {
  // [START auth_simple_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  linkWithCredential(auth.currentUser, credential)
    .then((usercred) => {
      const user = usercred.user;
      console.log("Account linking success", user);
    }).catch((error) => {
      console.log("Account linking error", error);
    });
  // [END auth_simple_link]
}

function anonymousLink(credential) {
  // [START auth_anonymous_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  linkWithCredential(auth.currentUser, credential)
    .then((usercred) => {
      const user = usercred.user;
      console.log("Anonymous account successfully upgraded", user);
    }).catch((error) => {
      console.log("Error upgrading anonymous account", error);
    });
  // [END auth_anonymous_link]
}

function linkWithPopup() {
  // [START auth_link_with_popup]
  const { getAuth, linkWithPopup, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  const auth = getAuth(firebaseApp);
  linkWithPopup(auth.currentUser, provider).then((result) => {
    // Accounts successfully linked.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    // ...
  });
  // [END auth_link_with_popup]
}

function linkWithRedirect() {
  // [START auth_link_with_redirect]
  const { getAuth, linkWithRedirect, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  const auth = getAuth(firebaseApp);
  linkWithRedirect(auth.currentUser, provider)
    .then(/* ... */)
    .catch(/* ... */);
  // [END auth_link_with_redirect]

  // [START auth_get_redirect_result]
  const { getRedirectResult } = require("firebase/auth");
  getRedirectResult(auth).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      // Accounts successfully linked.
      const user = result.user;
      // ...
    }
  }).catch((error) => {
    // Handle Errors here.
    // ...
  });
  // [END auth_get_redirect_result]
}

function mergeAccounts(newCredential) {
  // [START auth_merge_accounts]
  const { getAuth, signInWithCredential, linkWithCredential, OAuthProvider } = require("firebase/auth");

  // The implementation of how you store your user data depends on your application
  const repo = new MyUserDataRepo();

  // Get reference to the currently signed-in user
  const auth = getAuth(firebaseApp);
  const prevUser = auth.currentUser;

  // Get the data which you will want to merge. This should be done now
  // while the app is still signed in as this user.
  const prevUserData = repo.get(prevUser);

  // Delete the user's data now, we will restore it if the merge fails
  repo.delete(prevUser);

  // Sign in user with the account you want to link to
  signInWithCredential(auth, newCredential).then((result) => {
    console.log("Sign In Success", result);
    const currentUser = result.user;
    const currentUserData = repo.get(currentUser);

    // Merge prevUser and currentUser data stored in Firebase.
    // Note: How you handle this is specific to your application
    const mergedData = repo.merge(prevUserData, currentUserData);

    const credential = OAuthProvider.credentialFromResult(result);
    return linkWithCredential(prevUser, credential)
      .then((linkResult) => {
        // Sign in with the newly linked credential
        const linkCredential = OAuthProvider.credentialFromResult(linkResult);
        return signInWithCredential(auth, linkCredential);
      })
      .then((signInResult) => {
        // Save the merged data to the new user
        repo.set(signInResult.user, mergedData);
      });
  }).catch((error) => {
    // If there are errors we want to undo the data merge/deletion
    console.log("Sign In Error", error);
    repo.set(prevUser, prevUserData);
  });
  // [END auth_merge_accounts]
}

function makeEmailCredential() {
  const email = "test@test.com";
  const password = "abcde12345";

  // [START auth_make_email_credential]
  const { EmailAuthProvider } = require("firebase/auth");

  const credential = EmailAuthProvider.credential(email, password);
  // [END auth_make_email_credential]
}

function unlink(providerId) {
  // [START auth_unlink_provider]
  const { getAuth, unlink } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  unlink(auth.currentUser, providerId).then(() => {
    // Auth provider unlinked from account
    // ...
  }).catch((error) => {
    // An error happened
    // ...
  });
  // [END auth_unlink_provider]
}
