// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]

function getMessagingObject() {
  // [START messaging_get_messaging_object]
  const { getMessaging } = require("firebase/messaging");

  const messaging = getMessaging();
  // [END messaging_get_messaging_object]
}

function receiveMessage() {
  // [START messaging_receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  const { getMessaging, onMessage } = require("firebase/messaging");

  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
  });
  // [END messaging_receive_message]
}

function getToken() {
  // [START messaging_get_token]
  const { getMessaging, getToken } = require("firebase/messaging");

  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  const messaging = getMessaging();
  getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  // [END messaging_get_token]
}

function register() {
  // [START messaging_register]
  const { getMessaging, onRegistered, register } = require("firebase/messaging");

  const messaging = getMessaging();

  // 1. Implement callback to receive the Firebase installation ID upon registration.
  // This is triggered every time a manual register() finishes, a FID change
  // is detected, or a pushsubscriptionchange event is fired.
  onRegistered(messaging, (installationId) => {
    console.log('Registered installation ID:', installationId);

    // Send the Firebase Installation ID to your app server and update the UI if needed.
    sendRegistrationToServer(installationId);
  });

  // 2. You can also manually trigger registration (recommended on app startup)
  register(messaging, {
    vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>'
  }).then(() => {
    // Success! The Firebase Installation ID can be used to target messages to this app
    // instance and will be delivered asynchronously to your onRegistered() callback.
  }).catch((err) => {
    console.error('An error occurred while registering', err);
  });
  // [END messaging_register]
}

function requestPermission() {
  // [START messaging_request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve a registration token for use with FCM.
      // ...
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
  // [END messaging_request_permission]
}

function deleteToken() {
  // [START messaging_delete_token]
  const { getMessaging, deleteToken } = require("firebase/messaging");

  const messaging = getMessaging();
  deleteToken(messaging).then(() => {
    console.log('Token deleted.');
    // ...
  }).catch((err) => {
    console.log('Unable to delete token. ', err);
  });
  // [END messaging_delete_token]

  function sendRegistrationToServer(installationId) {
    // This function is used in a snippet to indicate that the Firebase Installation ID should be sent to the app server.
    // TODO(developer): Implement this function to send the registration ID to your app's server.
  }
}
