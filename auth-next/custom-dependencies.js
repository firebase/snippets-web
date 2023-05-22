// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/custom-dependencies.md

function getAuthEquivalent() {
  // [START auth_get_auth_equivalent]
  const {initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, browserSessionPersistence, indexedDBLocalPersistence} = require("firebase/auth");
  const {initializeApp} = require("firebase/app");

  const app = initializeApp({/** Your app config */});
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  // [END auth_get_auth_equivalent]
}

function onlyBrowserLocal() {
  // [START auth_only_browser_local]
  const {initializeAuth, browserLocalPersistence} = require("firebase/auth");
  const {initializeApp} = require("firebase/app");

  const app = initializeApp({/** Your app config */});
  const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
    // No popupRedirectResolver defined
  });
  // [END auth_only_browser_local]
}

function onlyIndexedDB() {
  // [START auth_only_indexed_db]
  const {initializeAuth, indexedDBLocalPersistence} = require("firebase/auth");
  const {initializeApp} = require("firebase/app");

  const app = initializeApp({/** Your app config */});
  const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
    // No popupRedirectResolver defined
  });
  // [END auth_only_indexed_db]
}

function signInRedirectManualDeps() {
  // [START auth_sign_in_redirect_manual_deps]
  const {initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, indexedDBLocalPersistence, signInWithRedirect, GoogleAuthProvider} = require("firebase/auth");
  const {initializeApp} = require("firebase/app");

  const app = initializeApp({/** Your app config */});
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  });

  // Later
  signInWithRedirect(auth, new GoogleAuthProvider(), browserPopupRedirectResolver);
  // [END auth_sign_in_redirect_manual_deps]
}