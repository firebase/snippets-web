// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
import firebase from "firebase/app";
import "firebase/auth";

const auth = firebase.auth();

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
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  var twitterProvider = new firebase.auth.TwitterAuthProvider();
  var githubProvider = new firebase.auth.GithubAuthProvider();
  // [END auth_get_providers]
}

function simpleLink(credential) {
  // [START auth_simple_link]
  auth.currentUser.linkWithCredential(credential)
    .then((usercred) => {
      var user = usercred.user;
      console.log("Account linking success", user);
    }).catch((error) => {
      console.log("Account linking error", error);
    });
  // [END auth_simple_link]
}

function anonymousLink(credential) {
  // [START auth_anonymous_link]
  auth.currentUser.linkWithCredential(credential)
    .then((usercred) => {
      var user = usercred.user;
      console.log("Anonymous account successfully upgraded", user);
    }).catch((error) => {
      console.log("Error upgrading anonymous account", error);
    });
  // [END auth_anonymous_link]
}

function linkWithPopup() {
  var provider = new firebase.auth.GoogleAuthProvider();

  // [START auth_link_with_popup]
  auth.currentUser.linkWithPopup(provider).then((result) => {
    // Accounts successfully linked.
    var credential = result.credential;
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    // ...
  });
  // [END auth_link_with_popup]
}

function linkWithRedirect() {
  var provider = new firebase.auth.GoogleAuthProvider();

  // [START auth_link_with_redirect]
  auth.currentUser.linkWithRedirect(provider)
    .then(/* ... */)
    .catch(/* ... */);
  // [END auth_link_with_redirect]

  // [START auth_get_redirect_result]
  auth.getRedirectResult().then((result) => {
    if (result.credential) {
      // Accounts successfully linked.
      var credential = result.credential;
      var user = result.user;
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
  // The implementation of how you store your user data depends on your application
  var repo = new MyUserDataRepo();

  // Get reference to the currently signed-in user
  var prevUser = auth.currentUser;

  // Get the data which you will want to merge. This should be done now
  // while the app is still signed in as this user.
  var prevUserData = repo.get(prevUser);

  // Delete the user's data now, we will restore it if the merge fails
  repo.delete(prevUser);

  // Sign in user with the account you want to link to
  auth.signInWithCredential(newCredential).then((result) => {
    console.log("Sign In Success", result);
    var currentUser = result.user;
    var currentUserData = repo.get(currentUser);

    // Merge prevUser and currentUser data stored in Firebase.
    // Note: How you handle this is specific to your application
    var mergedData = repo.merge(prevUserData, currentUserData);

    return prevUser.linkWithCredential(result.credential)
      .then((linkResult) => {
        // Sign in with the newly linked credential
        return auth.signInWithCredential(linkResult.credential);
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
  var email = "test@test.com";
  var password = "abcde12345";

  // [START auth_make_email_credential]
  var credential = firebase.auth.EmailAuthProvider.credential(email, password);
  // [END auth_make_email_credential]
}

function unlink(providerId) {
  var user = auth.currentUser;

  // [START auth_unlink_provider]
  user.unlink(providerId).then(() => {
    // Auth provider unlinked from account
    // ...
  }).catch((error) => {
    // An error happened
    // ...
  });
  // [END auth_unlink_provider]
}

function accountExistsPopup(facebookProvider, goToApp, promptUserForPassword, promptUserForSignInMethod, getProviderForProviderId) {
  // [START account_exists_popup]
  // User tries to sign in with Facebook.
      auth.signInWithPopup(facebookProvider).catch((error) => {
  // User's email already exists.
  if (error.code === 'auth/account-exists-with-different-credential') {
    // The pending Facebook credential.
    const pendingCred = error.credential;
    // The provider account's email address.
    const email = error.email;
    
    // Present the user with a list of providers they might have
    // used to create the original account.
    // Then, ask the user to sign in with the existing provider.
    const method = promptUserForSignInMethod();
      
    if (method === 'password') {
      // TODO: Ask the user for their password.
      // In real scenario, you should handle this asynchronously.
      const password = promptUserForPassword();
      auth.signInWithEmailAndPassword(email, password).then((result) => {
        return result.user.linkWithCredential(pendingCred);
      }).then(() => {
        // Facebook account successfully linked to the existing user.
        goToApp();
      });
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
    auth.signInWithPopup(provider).then((result) => {
      // Note: Identity Platform doesn't control the provider's sign-in
      // flow, so it's possible for the user to sign in with an account
      // with a different email from the first one.

      // Link the Facebook credential. We have access to the pending
      // credential, so we can directly call the link method.
      result.user.linkWithCredential(pendingCred).then((userCred) => {
        // Success.
        goToApp();
      });
    });
  }
});
// [END account_exists_popup]
}
