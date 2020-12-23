// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

function setPersistenceSession() {
  const email = "...";
  const password = "...";

  // [START auth_set_persistence_session]
  const { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  // [END auth_set_persistence_session]
}

function setPersistenceNone() {
  // [START auth_set_persistence_none]
  const { getAuth, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  setPersistence(auth, inMemoryPersistence)
    .then(() => {
      const provider = new GoogleAuthProvider();
      // In memory persistence will be applied to the signed in Google user
      // even though the persistence was set to 'none' and a page redirect
      // occurred.
      return signInWithRedirect(auth, provider);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  // [END auth_set_persistence_none]
}
