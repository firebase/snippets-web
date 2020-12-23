// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  projectId: '### PROJECT ID ###',
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
});

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/service-worker-sessions.md

function svcGetIdToken() {
  // [START auth_svc_get_idtoken]
  const { getAuth, getIdToken } = require("firebase/auth");

  const auth = getAuth(firebaseApp);
  getIdToken(auth.currentUser)
    .then((idToken) => {
      // idToken can be passed back to server.
    })
    .catch((error) => {
      // Error occurred.
    });
  // [END auth_svc_get_idtoken]
}

function svcSubscribe(config) {
  // [START auth_svc_subscribe]
  const { initializeApp } = require("firebase/app");
  const { getAuth, onAuthStateChanged, getIdToken } = require("firebase/auth");

  // Initialize the Firebase app in the service worker script.
  initializeApp(config);

  /**
   * Returns a promise that resolves with an ID token if available.
   * @return {!Promise<?string>} The promise that resolves with an ID token if
   *     available. Otherwise, the promise resolves with null.
   */
  const auth = getAuth(firebaseApp);
  const getIdTokenPromise = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          getIdToken(user).then((idToken) => {
            resolve(idToken);
          }, (error) => {
            resolve(null);
          });
        } else {
          resolve(null);
        }
      });
    });
  };
  // [END auth_svc_subscribe]
}

function svcIntercept() {
  // See above
  function getIdTokenPromise() {
    return Promise.resolve("id-token");
  }

  // [START auth_svc_intercept]
  const getOriginFromUrl = (url) => {
    // https://stackoverflow.com/questions/1420881/how-to-extract-base-url-from-a-string-in-javascript
    const pathArray = url.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    return protocol + '//' + host;
  };
  
  // Get underlying body if available. Works for text and json bodies.
  const getBodyContent = (req) => {
    return Promise.resolve().then(() => {
      if (req.method !== 'GET') {
        if (req.headers.get('Content-Type').indexOf('json') !== -1) {
          return req.json()
            .then((json) => {
              return JSON.stringify(json);
            });
        } else {
          return req.text();
        }
      }
    }).catch((error) => {
      // Ignore error.
    });
  };
  
  self.addEventListener('fetch', (event) => {
    /** @type {FetchEvent} */
    const evt = event;

    const requestProcessor = (idToken) => {
      let req = evt.request;
      let processRequestPromise = Promise.resolve();
      // For same origin https requests, append idToken to header.
      if (self.location.origin == getOriginFromUrl(evt.request.url) &&
          (self.location.protocol == 'https:' ||
           self.location.hostname == 'localhost') &&
          idToken) {
        // Clone headers as request headers are immutable.
        const headers = new Headers();
        req.headers.forEach((val, key) => {
          headers.append(key, val);
        });
        // Add ID token to header.
        headers.append('Authorization', 'Bearer ' + idToken);
        processRequestPromise = getBodyContent(req).then((body) => {
          try {
            req = new Request(req.url, {
              method: req.method,
              headers: headers,
              mode: 'same-origin',
              credentials: req.credentials,
              cache: req.cache,
              redirect: req.redirect,
              referrer: req.referrer,
              body,
              // bodyUsed: req.bodyUsed,
              // context: req.context
            });
          } catch (e) {
            // This will fail for CORS requests. We just continue with the
            // fetch caching logic below and do not pass the ID token.
          }
        });
      }
      return processRequestPromise.then(() => {
        return fetch(req);
      });
    };
    // Fetch the resource after checking for the ID token.
    // This can also be integrated with existing logic to serve cached files
    // in offline mode.
    evt.respondWith(getIdTokenPromise().then(requestProcessor, requestProcessor));
  });
  // [END auth_svc_intercept]
}

function svcListenActivate(clients) {
  // [START auth_svc_listen_activate]
  self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
  });
  // [END auth_svc_listen_activate]
}

function svcRegister() {
  // [START auth_svc_register]
  // Install servicerWorker if supported on sign-in/sign-up page.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'});
  }
  // [END auth_svc_register]
}

function svcSignInEmail(email, password) {
  // [START auth_svc_sign_in_email]
  const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

  // Sign in screen.
  const auth = getAuth(firebaseApp);
  signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      // Redirect to profile page after sign-in. The service worker will detect
      // this and append the ID token to the header.
      window.location.assign('/profile');
    })
    .catch((error) => {
      // Error occurred.
    });
  // [END auth_svc_sign_in_email]
}
