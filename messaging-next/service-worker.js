// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  appId: '### FIREBASE APP ID ###',
  projectId: '### FIREBASE PROJECT ID ###'
});

// See: https://github.com/microsoft/TypeScript/issues/14877
/** @type {ServiceWorkerGlobalScope} */
let self;

function initInSw() {
  // [START messaging_init_in_sw]
  const { initializeApp } = require("firebase/app");
  const { getMessaging } = require("firebase/messaging");

  // Initialize the Firebase app in the service worker by passing in
  // your app's Firebase config object.
  // https://firebase.google.com/docs/web/setup#config-object
  const firebaseApp = initializeApp({
    apiKey: 'api-key',
    authDomain: 'project-id.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'project-id',
    storageBucket: 'project-id.appspot.com',
    messagingSenderId: 'sender-id',
    appId: 'app-id',
    measurementId: 'G-measurement-id',
  });

  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = getMessaging(firebaseApp);
  // [END messaging_init_in_sw]
}

function onBackgroundMessage() {
  // [START messaging_on_background_message]
  // TODO(snippet): This snippet is not yet translated to the @exp SDK
  // [END messaging_on_background_message]
}
