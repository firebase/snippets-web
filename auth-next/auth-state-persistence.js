// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

async function setPersistenceSession() {
  const email = "...";
  const password = "...";

  // [START auth_set_persistence_session]
  const { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } = require("firebase/auth");

  const auth = getAuth();
  try {
    await setPersistence(auth, browserSessionPersistence);
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  }
  // [END auth_set_persistence_session]
}

async function setPersistenceNone() {
  // [START auth_set_persistence_none]
  const { getAuth, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth();
  try {
    await setPersistence(auth, inMemoryPersistence);
    const provider = new GoogleAuthProvider();
    // In memory persistence will be applied to the signed in Google user
    // even though the persistence was set to 'none' and a page redirect
    // occurred.
    return signInWithRedirect(auth, provider);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  }
  // [END auth_set_persistence_none]
}
