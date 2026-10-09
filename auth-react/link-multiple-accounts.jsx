// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

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

function simpleLink() {
  // [START auth_simple_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  function LinkAccountButton({ credential }) {
    async function link() {
      const auth = getAuth();
      try {
        const usercred = await linkWithCredential(auth.currentUser, credential);
        const user = usercred.user;
        console.log("Account linking success", user);
      } catch (error) {
        console.log("Account linking error", error);
      }
    }

    return <button onClick={link}>Link account</button>;
  }
  // [END auth_simple_link]
}

function anonymousLink() {
  // [START auth_anonymous_link]
  const { getAuth, linkWithCredential } = require("firebase/auth");

  function UpgradeAccountButton({ credential }) {
    async function upgrade() {
      const auth = getAuth();
      try {
        const usercred = await linkWithCredential(auth.currentUser, credential);
        const user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
      } catch (error) {
        console.log("Error upgrading anonymous account", error);
      }
    }

    return <button onClick={upgrade}>Upgrade account</button>;
  }
  // [END auth_anonymous_link]
}

function linkWithPopup() {
  // [START auth_link_with_popup]
  const { getAuth, linkWithPopup, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  function LinkGoogleButton() {
    async function link() {
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
    }

    return <button onClick={link}>Link Google</button>;
  }
  // [END auth_link_with_popup]
}

function linkWithRedirect() {
  // [START auth_link_with_redirect]
  const { getAuth, linkWithRedirect, GoogleAuthProvider } = require("firebase/auth");
  const provider = new GoogleAuthProvider();

  function LinkGoogleButton() {
    async function link() {
      const auth = getAuth();
      await linkWithRedirect(auth.currentUser, provider)
        .then(/* ... */)
        .catch(/* ... */);
    }

    return <button onClick={link}>Link Google</button>;
  }
  // [END auth_link_with_redirect]

  // [START auth_get_redirect_result]
  const { useEffect, useState } = require("react");
  const { getRedirectResult } = require("firebase/auth");

  function RedirectResult() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      getRedirectResult(auth).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          // Accounts successfully linked.
          const user = result.user;
          setUser(user);
        }
      }).catch((error) => {
        // Handle Errors here.
        // ...
      });
    }, []);

    return user ? <p>{user.displayName}</p> : null;
  }
  // [END auth_get_redirect_result]
}

function mergeAccounts() {
  // [START auth_merge_accounts]
  const { getAuth, signInWithCredential, deleteUser } = require("firebase/auth");

  function MergeAccountsButton({ newCredential }) {
    async function mergeAccounts() {
      // The implementation of how you store your user data depends on your application
      const repo = new MyUserDataRepo();

      // Get reference to the currently signed-in user
      const auth = getAuth();
      const prevUser = auth.currentUser;

      // Get the data which you will want to merge. This should be done now
      // while the app is still signed in as this user.
      const prevUserData = repo.get(prevUser);

      try {
        // Sign in user with the account you want to link to
        const result = await signInWithCredential(auth, newCredential);
        console.log("Sign In Success", result);
        const currentUser = result.user;
        const currentUserData = repo.get(currentUser);

        // Merge prevUser and currentUser data stored in Firebase.
        // Note: How you handle this is specific to your application
        const mergedData = repo.merge(prevUserData, currentUserData);

        // Save the merged data to the new user
        repo.set(currentUser, mergedData);

        // Delete the previous user's Firebase Auth account first
        await deleteUser(prevUser);
        repo.delete(prevUser);
      } catch (error) {
        console.log("Sign In Error", error);
      }
    }

    return <button onClick={mergeAccounts}>Merge accounts</button>;
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

function unlink() {
  // [START auth_unlink_provider]
  const { getAuth, unlink } = require("firebase/auth");

  function UnlinkButton({ providerId }) {
    async function unlinkProvider() {
      const auth = getAuth();
      try {
        await unlink(auth.currentUser, providerId);
        // Auth provider unlinked from account
        // ...
      } catch (error) {
        // An error happened
        // ...
      }
    }

    return <button onClick={unlinkProvider}>Unlink</button>;
  }
  // [END auth_unlink_provider]
}

function accountExistsPopup(auth, facebookProvider, goToApp, promptUserForPassword, promptUserForSignInMethod, getProviderForProviderId) {
  // [START account_exists_popup]
  const { signInWithPopup, signInWithEmailAndPassword, linkWithCredential, FacebookAuthProvider } = require("firebase/auth");

  function SignInButton() {
    async function signIn() {
      try {
        // User tries to sign in with Facebook.
        await signInWithPopup(auth, facebookProvider);
      } catch (error) {
        // User's email already exists.
        if (error.code === 'auth/account-exists-with-different-credential') {
          // The pending Facebook credential.
          const pendingCred = FacebookAuthProvider.credentialFromError(error);
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
            signInWithEmailAndPassword(auth, email, password).then((result) => {
              return linkWithCredential(result.user, pendingCred);
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
          signInWithPopup(auth, provider).then((result) => {
            // Note: Identity Platform doesn't control the provider's sign-in
            // flow, so it's possible for the user to sign in with an account
            // with a different email from the first one.

            // Link the Facebook credential. We have access to the pending
            // credential, so we can directly call the link method.
            linkWithCredential(result.user, pendingCred).then((userCred) => {
              // Success.
              goToApp();
            });
          });
        }
      }
    }

    return <button onClick={signIn}>Sign in with Facebook</button>;
  }
  // [END account_exists_popup]
}
