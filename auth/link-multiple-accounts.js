// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
var firebase = require('firebase');
var auth = firebase.auth();

var MyUserDataRepo = function() {};

MyUserDataRepo.prototype.merge = function(data1, data2) {
  // TODO(you): How you implement this is specific to your application!
  return {
    ...data1,
    ...data2,
  }
}

MyUserDataRepo.prototype.set = function(user, data) {
  // TODO(you): How you implement this is specific to your application!
}

MyUserDataRepo.prototype.delete = function(user) {
  // TODO(you): How you implement this is specific to your application!
}

MyUserDataRepo.prototype.get = function(user) {
  // TODO(you): How you implement this is specific to your application!
  return {};
}

function getProviders() {
  // [START auth_get_providers]
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  var twitterProvider = new firebase.auth.TwitterAuthProvider();
  var githubProvider = new firebase.auth.GithubAuthProvider();
  // [END auth_get_providers]
}

function linkWithPopup() {
  var provider = new firebase.auth.GoogleAuthProvider();

  // [START auth_link_with_popup]
  auth.currentUser.linkWithPopup(provider).then(function(result) {
    // Accounts successfully linked.
    var credential = result.credential;
    var user = result.user;
    // ...
  }).catch(function(error) {
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
  auth.getRedirectResult().then(function(result) {
    if (result.credential) {
      // Accounts successfully linked.
      var credential = result.credential;
      var user = result.user;
      // ...
    }
  }).catch(function(error) {
    // Handle Errors here.
    // ...
  });
  // [END auth_get_redirect_result]
}

// For one, the user variable in the line:
// return user.delete().then(function() {
// does not have a .delete function, it would need to be user.user.delete()
// & in this example they suggest:
// // Merge prevUser and currentUser data stored in Firebase
// which in this auth context (& assuming basic security rules enabled) would mean you would only have access to currentUser ’s storage, 
// but then they delete the current user & link the credential to the previous user. In otherwords you would only be able to merge the previous user’s 
// data into the current user’s storage, however the current user is deleted & no longer accessible
// So I’d just like a sanity check here that this example is indeed a flawed approach!


function mergeAccounts() {
  // This is just a dummy variable for sample purposes, the other
  // snippets demonstrate how to get a real credential.
  var newCredential = new firebase.auth.AuthCredential();

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
  auth.signInWithCredential(newCredential).then(function(result) {
    console.log("Sign In Success", result);
    var currentUser = result.user;
    var currentUserData = repo.get(currentUser);

    // Merge prevUser and currentUser data stored in Firebase.
    // Note: How you handle this is specific to your application
    var mergedData = repo.merge(prevUserData, currentUserData);

    return prevUser.linkWithCredential(result.credential)
      .then(function(linkResult) {
        // Sign in with the newly linked credential
        return auth.signInWithCredential(linkResult.credential);
      })
      .then(function(signInResult) {
        // Save the merged data to the new user
        repo.set(signInResult.user, mergedData);
      });
  }).catch(function(error) {
    // If there are errors we want to undo the data merge/deletion
    console.log("Sign In Error", error);
    repo.set(prevUser, prevUserData);
    repo.set(currentUser, currentUserData);
  });
  // [END auth_merge_accounts]
}

