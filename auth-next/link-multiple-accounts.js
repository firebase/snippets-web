// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

const MyUserDataRepo = function () { };

MyUserDataRepo.prototype.merge = function (data1, data2) {
  // TODO(you): How you implement this is specific to your application!
  return {
    ...data1,
    ...data2,
  };
};

MyUserDataRepo.prototype.set = function (user, data) {
  // TODO(you): How you implement this is specific to your application!
};

MyUserDataRepo.prototype.delete = function (user) {
  // TODO(you): How you implement this is specific to your application!
};

MyUserDataRepo.prototype.get = function (user) {
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

async function simpleLink(credential) {
  // [START auth_simple_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  const auth = getAuth();
  try {
    const usercred = await linkWithCredential(auth.currentUser, credential);
    const user = usercred.user;
    console.log("Account linking success", user);
  } catch (error) {
    console.log("Account linking error", error);
  }
  // [END auth_simple_link]
}

async function anonymousLink(credential) {
  // [START auth_anonymous_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  const auth = getAuth();
  try {
    const usercred = await linkWithCredential(auth.currentUser, credential);
    const user = usercred.user;
    console.log("Anonymous account successfully upgraded", user);
  } catch (error) {
    console.log("Error upgrading anonymous account", error);
  }
  // [END auth_anonymous_link]
}

async function linkWithPopup() {
  // [START auth_link_with_popup]
  const { getAuth, linkWithPopup, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  try {
    const result = await linkWithPopup(auth.currentUser, provider);
    // Accounts successfully linked.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    // ...
  } catch (error) {
    // Handle Errors here.
    // ...
  }
  // [END auth_link_with_popup]
}

async function linkWithRedirect() {
  // [START auth_link_with_redirect]
  const { getAuth, linkWithRedirect, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  try {
    await linkWithRedirect(auth.currentUser, provider);
    /* ... */
  } catch (error) {
    /* ... */
  }
  // [END auth_link_with_redirect]

  // [START auth_get_redirect_result]
  const { getRedirectResult } = require("firebase/auth");
  try {
    const result = await getRedirectResult(auth);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      // Accounts successfully linked.
      const user = result.user;
      // ...
    }
  } catch (error) {
    // Handle Errors here.
    // ...
  }
  // [END auth_get_redirect_result]
}

async function mergeAccounts(newCredential) {
  // [START auth_merge_accounts]
  const { getAuth, signInWithCredential, linkWithCredential, OAuthProvider } = require("firebase/auth");

  // The implementation of how you store your user data depends on your application
  const repo = new MyUserDataRepo();

  // Get reference to the currently signed-in user
  const auth = getAuth();
  const prevUser = auth.currentUser;

  // Get the data which you will want to merge. This should be done now
  // while the app is still signed in as this user.
  const prevUserData = repo.get(prevUser);

  // Delete the user's data now, we will restore it if the merge fails
  repo.delete(prevUser);

  // Sign in user with the account you want to link to
  try {
    const result = await signInWithCredential(auth, newCredential);
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
  } catch (error) {
    // If there are errors we want to undo the data merge/deletion
    console.log("Sign In Error", error);
    repo.set(prevUser, prevUserData);
  }
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

async function unlink(providerId) {
  // [START auth_unlink_provider]
  const { getAuth, unlink } = require("firebase/auth");

  const auth = getAuth();
  try {
    await unlink(auth.currentUser, providerId);
    // Auth provider unlinked from account
    // ...
  } catch (error) {
    // An error happened
    // ...
  }
  // [END auth_unlink_provider]
}

async function accountExistsPopup(auth, facebookProvider, goToApp, promptUserForPassword, promptUserForSignInMethod, getProviderForProviderId) {
  // [START account_exists_popup]
  const { signInWithPopup, signInWithEmailAndPassword, linkWithCredential } = require("firebase/auth");

  try {
    // User tries to sign in with Facebook.
    await signInWithPopup(auth, facebookProvider);
  } catch (error) {
    // User's email already exists.
    if (error.code === 'auth/account-exists-with-different-credential') {
      // The pending Facebook credential.
      const pendingCred = error.credential;
      // The provider account's email address.
      const email = error.customData.email;

      // Present the user with a list of providers they might have
      // used to create the original account.
      // Then, ask the user to sign in with the existing provider.
      const method = promptUserForSignInMethod();

      if (method === 'password') {
        // TODO: Ask the user for their password.
        // In real scenario, you should handle this asynchronously.
        const password = promptUserForPassword();
        const result = signInWithEmailAndPassword(auth, email, password);
        await linkWithCredential(result.user, pendingCred);
        // Facebook account successfully linked to the existing user.
        goToApp();
        return;
      }

      // All other cases are external providers.
      // Construct provider object for that provider.
      // TODO: Implement getProviderForProviderId.
      const provider = getProviderForProviderId(method);
      // At this point, you should let the user know that they already have an
      // account with a different provider, and validate they want to sign in
      // with the new provider.
      // Note: Browsers usually block popups triggered asynchronously, so in
      // real app, you should ask the user to click on a "Continue" button
      // that will trigger signInWithPopup().
      const result = await signInWithPopup(auth, provider);
      // Note: Identity Platform doesn't control the provider's sign-in
      // flow, so it's possible for the user to sign in with an account
      // with a different email from the first one.

      // Link the Facebook credential. We have access to the pending
      // credential, so we can directly call the link method.
      const userCred = await linkWithCredential(result.user, pendingCred);
      // Success.
      goToApp();
    }
  }
  // [END account_exists_popup]
}
